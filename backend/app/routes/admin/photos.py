from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from datetime import datetime
from app.api.deps import get_current_admin
from app.services.photo_service import PhotoService
from app.schemas.photo import PhotoResponse
from pydantic import BaseModel

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


# Schema for what the frontend sends when editing
class PhotoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    artist_name: str | None = None
    is_archived: bool | None = None
    in_gallery: bool | None = None
    is_uncategorized: bool | None = None
    collection_id: int | None = None
    new_collection_name: str | None = None
    date_taken: datetime | None = None


@router.get("/{photo_id}")
async def get_single_photo(
    photo_id: int,
    service: PhotoService = Depends(PhotoService),
):
    # We will add this method to the service next
    photo = await service.photo_repo.get_photo_by_id(photo_id)
    if not photo:
        raise HTTPException(404, "Photo not found")
    return photo


@router.patch("/{photo_id}", response_model=PhotoResponse)
async def update_photo(
    photo_id: int,
    data: PhotoUpdate,
    service: PhotoService = Depends(PhotoService),
):
    try:
        # exclude_unset=True means we only update the fields the user actually changed
        updated = await service.update_photo_metadata(
            photo_id, data.model_dump(exclude_unset=True)
        )
        # Return photo object
        return updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/collections/{collection_id}")
async def delete_collection(
    collection_id: int,
    service: PhotoService = Depends(PhotoService),
):
    try:
        # Move all photos in collection to Archive
        await service.photo_repo.archive_collection_photos(collection_id)

        # Delete collection itself
        await service.collection_repo.delete_collection(collection_id)

        return {"message": "Collection Deleted"}
    except Exception as e:
        raise HTTPException(500, str(e))


@router.delete("/{photo_id}")
async def delete_photo(
    photo_id: int,
    service: PhotoService = Depends(PhotoService),
):
    try:
        await service.delete_photo(photo_id)
        return {"message": "Photo Deleted Successfully"}
    except Exception as e:
        raise HTTPException(500, str(e))
