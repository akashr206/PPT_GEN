from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import anyio
from db import save_user, get_user_by_email
from utils.response import success_response
from utils.get_id import generate_short_id
router = APIRouter(prefix="/user", tags=["User"])

class SaveUserRequest(BaseModel):
    email: str
    name: str
    image: str = None,
    p_name: str

@router.post("/sign-in")
async def save_user_info(payload: SaveUserRequest):
    try:
        user = await anyio.to_thread.run_sync(
            get_user_by_email,
            payload.email,
        )
        
        if not user:
            id = generate_short_id()
            user = await anyio.to_thread.run_sync(
                save_user,
                id,
                payload.email,
                payload.name,
                payload.p_name,
                payload.image
            )

        return success_response(message="User saved successfully", data=user, status=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save user: {str(e)}")
