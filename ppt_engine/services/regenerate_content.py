import anyio
import json
from services.llm_chat import chat
from services.gen_ppt_content import parse_json_output
from db.operations import get_presentation_by_id, update_outline, update_ppt_status, save_conversation_message

async def regenerate_ppt_content_bg(ppt_id: str, prompt: str):
    try:
        ppt = await anyio.to_thread.run_sync(get_presentation_by_id, ppt_id)
        if not ppt:
            raise ValueError(f"Presentation {ppt_id} not found")

        current_json = {
            "title": ppt.get("title"),
            "presenter": ppt.get("presenter"),
            "theme": ppt.get("theme"),
            "slides": ppt.get("slides")
        }

        await anyio.to_thread.run_sync(save_conversation_message, ppt_id, "user", prompt)

        system_prompt = f"""
You are an expert Presentation Editor. 
The user will provide an instruction to edit the presentation outline and/or theme.
Here is the current presentation outline in JSON:
{json.dumps(current_json, indent=2)}

Please output the completely updated presentation as a JSON object, AND include a top-level "message" field where you explain to the user what you changed in concise.
Your JSON must match this structure:
{{
  "message": "Your explanation of the changes made",
  "title": "Presentation Title",
  "presenter": "Presenter Name",
  "theme": "selected_theme",
  "slides": [ ... ]
}}

User Instruction: {prompt}
"""
        
        raw_output = await chat(system_prompt)
        parsed_json = parse_json_output(raw_output)

        new_message = parsed_json.get("message", "I have updated the presentation as requested.")

        # Save the assistant message
        await anyio.to_thread.run_sync(save_conversation_message, ppt_id, "assistant", new_message)

        # Update the outline
        await anyio.to_thread.run_sync(
            lambda: update_outline(
                ppt_id=ppt_id,
                slides_json=parsed_json.get("slides", current_json["slides"]),
                theme=parsed_json.get("theme", current_json["theme"]),
                title=parsed_json.get("title", current_json["title"]),
                presenter=parsed_json.get("presenter", current_json["presenter"])
            )
        )

        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "DRAFT")

    except Exception as e:
        print(f"Error in background regeneration: {e}")
        await anyio.to_thread.run_sync(update_ppt_status, ppt_id, "FAILED")
