from db.connection import get_supabase_client
from db.operations import (
    generate_short_id,
    save_presentation,
    get_all_presentations,
    get_presentation_by_id,
    get_user,
    save_user,
    get_user_by_email,
    delete_ppt
)
