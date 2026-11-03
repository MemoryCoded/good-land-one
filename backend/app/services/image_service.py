from PIL import Image
from io import BytesIO
import asyncio
from app.services.storage_service import upload_file_locally

# Import and register HEIF opener
import pillow_heif

pillow_heif.register_heif_opener()


def process_and_save_image(file_bytes: bytes, filename: str) -> dict:
    """
    Reads raw image bytes, creates 3 thumbnails, saves them locally,
    and returns the database-ready metadata.
    """
    try:
        # 1. Open the image using Pillow
        img = Image.open(BytesIO(file_bytes))
    except Exception:
        raise ValueError(f"File '{filename}' is not a valid image format.")

    # 2. Extract EXIF date (if it exists)
    exif = img.getexif()
    date_taken = exif.get(36867)  # 36867 is the EXIF tag for DateTimeOriginal

    # 3. Prepare the base metadata dictionary
    result = {
        "width": img.width,
        "height": img.height,
        "mime_type": img.get_format_mimetype(),
        "date_taken": date_taken,
    }

    # 4. Helper function to resize and save
    def save_thumb(size: int, label: str):
        copy = img.copy()

        # HEIC images might have an alpha channel or be in a different mode,
        # convert to RGB before saving as WEBP
        copy = copy.convert("RGB")
        # .thumbnail() shrinks the image
        # NEVER upscales it (protecting small images)
        copy.thumbnail((size, size), Image.Resampling.LANCZOS)

        buffer = BytesIO()
        # Save as WEBP for small file sizes and high quality
        copy.save(buffer, format="WEBP", quality=85)
        webp_bytes = buffer.getvalue()

        # FORCE webp
        webp_filename = filename.rsplit(".", 1)[0] + ".webp"

        # Save to disk using our Local Storage Adapter
        # Since we are inside a synchronous function, we use asyncio.run() to call the async upload
        url = asyncio.run(upload_file_locally(webp_bytes, webp_filename, label))
        return url

    # 5. Generate the three sizes
    sizes = {"small": 400, "medium": 1000, "large": 2000}
    for label, size in sizes.items():
        result[f"thumb_{label}"] = save_thumb(size, label)

    # 6. Save the original untouched file to disk
    result["filename"] = asyncio.run(
        upload_file_locally(file_bytes, filename, "original")
    )

    return result
