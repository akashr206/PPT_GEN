

def convert_to_buffer(path: str) -> bytes:
    try:
        with open(path, "rb") as f:
            return f.read()
    except Exception as e:
        raise Exception(f"Failed to convert {path} to buffer: {str(e)}")