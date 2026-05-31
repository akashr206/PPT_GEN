from db.connection import get_supabase_client
from utils.get_id import generate_short_id
import time

client = get_supabase_client()

def save_presentation(title: str, presenter: str, theme: str, slides: list, tone: str = "professional", userID: str = None, ppt_id: str = None, status: str = "GENERATING_OUTLINE"):
    """
    Saves a generated presentation metadata and slides JSON list into the Supabase 'ppts' table.
    """
    if not ppt_id:
        ppt_id = generate_short_id()
        
    data = {
        "id": ppt_id,
        "title": title,
        "presenter": presenter,
        "theme": theme,
        "slides": slides,
        "tone": tone,
        "userID": userID,
        "status": status
    }
    
    response = client.table("ppts").insert(data).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    return data

def get_presentation_by_id(presentation_id: str):
    """
    Retrieves detailed information for a single presentation by its varchar(10) ID from Supabase.
    """
    start = time.perf_counter()

    response = client.table("ppts").select("id, title, presenter, theme, slides, tone, userID, url, ppt_url, status, thumbnail").eq("id", presentation_id).execute()
    print("get ppt API:", time.perf_counter() - start)
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def get_all_presentations(userID: str = None):
    """
    Retrieves detailed information for all presentations by a specific userID from Supabase.
    """
    start = time.perf_counter()

    response = (client.table("ppts_summary")
    .select("*")
    .eq("userID", userID)
    .order("created_at", desc=True)
    .execute())
    print("get all ppt API:", time.perf_counter() - start)
    if response.data and len(response.data) > 0:
        return response.data
    return None

def get_user(userID):
    """
    Retrieves detailed information for a specific user by userID from Supabase.
    """
    response = client.table("users").select("id, email, name, p_name").eq("id", userID).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def get_user_by_email(email:str):
    """
    Retrieves detailed information for a specific user by email from Supabase.
    """
    response = client.table("users").select("id, email, name, p_name").eq("email", email).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def update_url(ppt_id: str, url: str, ppt_url: str, thumbnail_url: str):
    """
    Updates the URL of a specific presentation by its ID.
    """
    response = client.table("ppts").update({"url": url, "ppt_url" : ppt_url, "thumbnail": thumbnail_url}).eq("id", ppt_id).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def save_user(userID: str, email: str, name: str, p_name: str, image: str = None):
    """
    Saves or updates user metadata in the Supabase 'users' table.
    """
    data = {
        "id": userID,
        "email": email,
        "name": name,
        "p_name": p_name,
        "image" : image,
        
    }
    response = client.table("users").insert(data).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return data

def delete_ppt(ppt_id: str):
    """
    Deletes a specific presentation by its ID from Supabase.
    """
    response = client.table("ppts").delete().eq("id", ppt_id).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def update_ppt_status(ppt_id: str, status: str):
    """
    Updates the status of a specific presentation.
    """
    response = client.table("ppts").update({"status": status}).eq("id", ppt_id).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def update_outline(ppt_id: str, slides_json: list, theme: str = None, title: str = None, presenter: str = None):
    """
    Updates the slides (outline) and optionally theme, title, presenter for a specific presentation.
    """
    update_data = {"slides": slides_json}
    if theme:
        update_data["theme"] = theme
    if title:
        update_data["title"] = title
    if presenter:
        update_data["presenter"] = presenter
        
    response = client.table("ppts").update(update_data).eq("id", ppt_id).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None

def save_conversation_message(ppt_id: str, role: str, message: str):
    """
    Saves a message to the ppt_conversations table.
    """
    data = {
        "ppt_id": ppt_id,
        "role": role,
        "message": message
    }
    response = client.table("ppt_conversations").insert(data).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    return data

def get_conversation(ppt_id: str):
    """
    Retrieves the conversation history for a given ppt_id.
    """
    start = time.perf_counter()

    response = client.table("ppt_conversations").select("*").eq("ppt_id", ppt_id).order("created_at", desc=False).execute()
    print("get convo API:", time.perf_counter() - start)
    if response.data:
        return response.data
    return []