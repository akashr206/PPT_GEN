from db import delete_ppt
from db import get_supabase_client
from utils.response import success_response, error_response

def delete_full_ppt(ppt_id: str):
    client = get_supabase_client()
    if not ppt_id:
        return error_response("PPT ID is required", status=400)

    client.storage.from_("ppts").remove(f"{ppt_id}/ppt.pptx")
    client.storage.from_("ppts").remove(f"{ppt_id}/ppt.pdf")
    presentation = delete_ppt(ppt_id)
    if not presentation:
        return error_response("PPT not found", status=404)
    return success_response("PPT deleted successfully", status=200)
    
    
    

