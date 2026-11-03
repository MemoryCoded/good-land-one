from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.api.deps import get_current_admin
from app.services.photo_service import PhotoService

"""
Admin Upload Route

"""
router = APIRouter(
    prefix="/api/admin/photos",
    dependencies=[Depends(get_current_admin)],
)


@router.post("/upload")
async def upload_photos(
    files: list[UploadFile] = File(...),
    collection_id: int = Form(...),
    # Admin toggles for placement
    is_archived: bool = Form(True),  # Default to archive
    in_gallery: bool = Form(False),  # Not in gallery
    is_uncategorized: bool = Form(False),  # Default to not Uncat
    service: PhotoService = Depends(PhotoService),
):
    if len(files) > 50:
        raise HTTPException(status_code=400, detail="Max 50 files per batch")

    try:
        count = await service.process_upload_batch(
            files=files,
            collection_id=collection_id,
            is_archived=is_archived,
            in_gallery=in_gallery,
            is_uncategorized=is_uncategorized,
        )

        return {"message": f"Successfully uploaded {count} photos"}

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/library")
async def get_admin_library(
    skip: int = 0, limit: int = 100, service: PhotoService = Depends(PhotoService)
):
    photos = await service.get_admin_library(skip=skip, limit=limit)
    return photos
