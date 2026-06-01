from sys import stderr
from db.connection import get_supabase_client
import subprocess
from utils.convert_to_buffer import convert_to_buffer
import os
import asyncio
import anyio

from utils.response import success_response, error_response
import fitz
from PIL import Image
import io

async def upload_ppt(ppt_path, id: str):
    try:
        process = await asyncio.create_subprocess_exec(
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            f"gen_ppts/{id}/ppt.pptx",
            "--outdir",
            f"gen_ppts/{id}",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()
        
        doc = fitz.open(f"gen_ppts/{id}/ppt.pdf")
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=150)
        png_bytes = pix.tobytes("png")
        doc.close()

        img = Image.open(io.BytesIO(png_bytes))
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='webp')
        img_bytes = img_buffer.getvalue()

        if process.returncode != 0:
            raise Exception(f"Failed to convert PPT to PDF")
        def _sync_upload_and_cleanup():
            ppt_buffer = convert_to_buffer(ppt_path)
            pdf_buffer = convert_to_buffer(f"gen_ppts/{id}/ppt.pdf")
            
            supabase = get_supabase_client()

            supabase.storage.from_("ppts").upload(f"{id}/ppt.pptx", ppt_buffer, file_options={"upsert" : "true", "content-type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"})
            supabase.storage.from_("ppts").upload(f"{id}/ppt.pdf", pdf_buffer, file_options={"upsert" : "true", "content-type": "application/pdf"})
            supabase.storage.from_("ppts").upload(f"{id}/thumbnail.webp", img_bytes, file_options={"upsert" : "true", "content-type": "image/webp"})
            
            os.remove(ppt_path)
            os.remove(f"gen_ppts/{id}/ppt.pdf")
            os.rmdir(f"gen_ppts/{id}")

        await anyio.to_thread.run_sync(_sync_upload_and_cleanup)

        return success_response(message="PPT uploaded successfully")
    except Exception as e:
        def _sync_cleanup():
            if os.path.exists(ppt_path):
                os.remove(ppt_path)
            if os.path.exists(f"gen_ppts/{id}/ppt.pdf"):
                os.remove(f"gen_ppts/{id}/ppt.pdf")
            if os.path.exists(f"gen_ppts/{id}"):
                os.rmdir(f"gen_ppts/{id}")
        
        await anyio.to_thread.run_sync(_sync_cleanup)
        return error_response(message=str(e), status=500)