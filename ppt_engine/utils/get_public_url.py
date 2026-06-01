import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.connection import get_supabase_client


def get_public_url(bucket, file_name):
    supabase = get_supabase_client()
    res = supabase.storage.from_(bucket).get_public_url(file_name)
    return res