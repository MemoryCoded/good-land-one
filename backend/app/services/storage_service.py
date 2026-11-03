import os
import uuid

# Defining where files will be saved locally
UPLOAD_DIR = "static/uploads"

# Make sure its there
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def upload_file_locally(
    file_bytes: bytes, original_filename: str, suffix: str
) -> str:
    """
    Saves file to local disk and return its public URL path
    """

    # Generate a unique ID to prevent filename collisins
    file_id = uuid.uuid4().hex[:8]

    # Clean the filename
    clean_name = original_filename.replace(" ", "_").lower()

    # Building final filename
    filename = f"{file_id}_{suffix}_{clean_name}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Write raw bytes to hard drive
    with open(filepath, "wb") as f:
        f.write(file_bytes)

    # Return URL path
    return f"/static/uploads/{filename}"
