import anyio
from db import save_presentation
from services.llm_chat import chat
import json
import re
from db.operations import get_user, update_outline, update_ppt_status, save_conversation_message

def parse_json_output(output_str: str) -> dict:
    """
    Robustly parses JSON content from a string that might be wrapped in markdown code blocks
    or contain leading/trailing conversational text.
    """
    clean_str = output_str.strip()
    
    code_block_match = re.search(r"```(?:json)?\s*(.*?)\s*```", clean_str, re.DOTALL)
    if code_block_match:
        clean_str = code_block_match.group(1).strip()
        
    if not (clean_str.startswith("{") and clean_str.endswith("}")):
        first_curly = clean_str.find("{")
        last_curly = clean_str.rfind("}")
        if first_curly != -1 and last_curly != -1:
            clean_str = clean_str[first_curly:last_curly + 1]
            
    return json.loads(clean_str)

from utils.response import success_response, error_response

async def generate_ppt_content_bg(ppt_id: str, prompt: str, tone: str = "professional", slides : int = 5, theme: str = "professional", userID: str = None):
    try:
        user = get_user(userID)
        p_name = user["p_name"]
        updated_prompt = prompt + "\n" + f"Preffered tone: {tone}, Number of Slides: {slides}, Preferred theme type: {theme}, Presenter: {p_name}, "
        raw_output = await chat(updated_prompt)
        parsed_json = parse_json_output(raw_output)
        
        await anyio.to_thread.run_sync(
            lambda: update_outline(
                ppt_id=ppt_id,
                slides_json=parsed_json.get("slides", []),
                theme=parsed_json.get("theme", "neon_rose"),
                title=parsed_json.get("title", "Untitled Presentation"),
                presenter=parsed_json.get("presenter", "User")
            )
        )
        
        await anyio.to_thread.run_sync(save_conversation_message, ppt_id, "user", prompt)
        
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "DRAFT")
    except Exception as e:
        print(f"Error in background generation: {e}")
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "FAILED")