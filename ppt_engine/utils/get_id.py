import string
import secrets

def generate_short_id(length=10):
    """
    Generates a cryptographically secure 10-character alphanumeric ID.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))