import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import io
import anyio
from services.ppt_engine import PPTEngine
from utils.themes import THEMES
from services.upload_ppt import upload_ppt
from db.operations import get_presentation_by_id, update_url, update_ppt_status
from utils.get_public_url import get_public_url


from utils.response import success_response, error_response

async def build_ppt_bg(ppt_id: str):
    try:
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "BUILDING_PPT")
        
        ppt_content = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        
        if not ppt_content:
            raise ValueError("Presentation not found")

        def _sync_build_and_save():
            engine = PPTEngine(ppt_content, ppt_content["theme"])
            presentation = engine.build()
            os.makedirs(f"gen_ppts/{ppt_id}", exist_ok=True)
            engine.save(presentation, f"gen_ppts/{ppt_id}/ppt.pptx")

        await anyio.to_thread.run_sync(_sync_build_and_save)
        
        res = await upload_ppt(f"gen_ppts/{ppt_id}/ppt.pptx", ppt_id)
        if not res["success"]:
            raise Exception(res["message"])
        
        url = get_public_url("ppts", f"{ppt_id}/ppt.pdf")
        ppt_url = get_public_url("ppts", f"{ppt_id}/ppt.pptx")
        thumb_url = get_public_url("ppts", f"{ppt_id}/thumbnail.webp")
        await anyio.to_thread.run_sync(update_url, ppt_id, url, ppt_url, thumb_url)

        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "COMPLETED")

    except Exception as e:
        print("excp: ", e)
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "BUILD_FAILED")