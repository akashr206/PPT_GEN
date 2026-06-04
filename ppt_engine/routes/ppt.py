from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
import anyio

from services.gen_ppt_content import generate_ppt_content_bg
from services.build_ppt import build_ppt_bg
from services.regenerate_content import regenerate_ppt_content_bg
from db.operations import get_all_presentations, get_presentation_by_id, save_presentation, update_outline, get_conversation, update_ppt_status
from utils.response import success_response
from utils.get_id import generate_short_id
from controllers.ppt.delete_ppt import delete_full_ppt

router = APIRouter(prefix="/api/ppt", tags=["PPT"])

class GenerationRequest(BaseModel):
    prompt: str
    tone: str = "professional"
    slides: int
    theme: str = "professional"

@router.post("/generate")
async def generate_presentation(request: Request, payload: GenerationRequest, background_tasks: BackgroundTasks):
    """
    Generate a PowerPoint presentation based on a user prompt (Background task).
    """
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    user = getattr(request.state, "user", None)
    userID = user.get("id") if user else None
    
    ppt_id = generate_short_id()
    
    await anyio.to_thread.run_sync(
        lambda: save_presentation(
            title="Generating...",
            presenter="Generating...",
            theme=payload.theme,
            slides=[],
            tone=payload.tone,
            userID=userID,
            ppt_id=ppt_id,
            status="GENERATING_OUTLINE"
        )
    )
    
    background_tasks.add_task(
        generate_ppt_content_bg,
        ppt_id=ppt_id, prompt=payload.prompt, tone=payload.tone, slides=payload.slides, theme=payload.theme, userID=userID
    )

    return success_response(message="Generation started", data={"ppt_id": ppt_id, "status": "GENERATING_OUTLINE"})


@router.post("/build/{ppt_id}")
async def create_ppt(request: Request, ppt_id: str, background_tasks: BackgroundTasks):
    """
    Trigger building a ppt with given id.
    """
    try:
        ppt_content = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if ppt_content:
            user = getattr(request.state, "user", None)
            if user and ppt_content.get("userID") != user.get("id"):
                raise HTTPException(status_code=403, detail="Not authorized to build this presentation")

        background_tasks.add_task(build_ppt_bg, ppt_id)
        return success_response(message="Build started", data={"ppt_id": ppt_id, "status": "BUILDING_PPT"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start build: {str(e)}")

@router.get("/history")
async def fetch_history(request: Request):
    """
    Fetch history of generated presentations from Neon DB for the authenticated user.
    """
    try:
        user = getattr(request.state, "user", None)
        userID = user.get("id") if user else None
        history = await anyio.to_thread.run_sync(get_all_presentations, userID)
        return success_response(data=history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval failed: {str(e)}")

@router.get("/{ppt_id}")
async def fetch_presentation(request: Request, ppt_id: str):
    """
    Fetch details of a specific generated presentation by varchar(10) ID from Neon DB.
    """
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized to access this presentation")
            
        return success_response(data=presentation)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

@router.get("/{ppt_id}/status")
async def fetch_status(request: Request, ppt_id: str):
    """
    Fetch the current status for polling.
    """
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized")
            
        return success_response(data={
            "status": presentation.get("status")
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ppt_id}/messages")
async def fetch_messages(request: Request, ppt_id: str):
    """
    Fetch the conversation history messages for a specific presentation.
    """
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized")
            
        messages = await anyio.to_thread.run_sync(get_conversation, ppt_id)
        return success_response(data={
            "messages": messages
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OutlineUpdateRequest(BaseModel):
    slides: list
    theme: str = None
    title: str = None
    presenter: str = None

@router.put("/{ppt_id}")
async def update_outline_endpoint(request: Request, ppt_id: str, payload: OutlineUpdateRequest):
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized")
            
        res = await anyio.to_thread.run_sync(
            lambda: update_outline(ppt_id, payload.slides, payload.theme, payload.title, payload.presenter)
        )
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "EDITING")
        if res:
            res["status"] = "EDITING"
        return success_response(message="Outline updated", data=res)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RegenerateRequest(BaseModel):
    prompt: str

@router.post("/{ppt_id}/regenerate")
async def regenerate_ppt(request: Request, ppt_id: str, payload: RegenerateRequest, background_tasks: BackgroundTasks):
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized")
            
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "EDITING")
        background_tasks.add_task(regenerate_ppt_conteznt_bg, ppt_id, payload.prompt)
        
        return success_response(message="Regeneration started", data={"ppt_id": ppt_id, "status": "EDITING"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{ppt_id}")
async def delete_ppt(request: Request, ppt_id: str):
    """
    Delete a specific generated presentation by varchar(10) ID from Neon DB.
    """
    try:
        presentation = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not presentation:
            raise HTTPException(status_code=404, detail="Presentation not found")
            
        user = getattr(request.state, "user", None)
        if user and presentation.get("userID") != user.get("id"):
            raise HTTPException(status_code=403, detail="Not authorized to delete this presentation")
        res = delete_full_ppt(ppt_id)
        if not res["success"]:
            raise HTTPException(status_code=res.get("status", 500), detail=res.get("message"))
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")