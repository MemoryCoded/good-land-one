from fastapi import APIRouter, Depends, Query

from app.schemas.photo import PhotoResponse
from app.services.photo_service import PhotoService

"""
Routes are the HTTP layer.
They parse input, call the service,
and return the response.
"""

router = APIRouter(prefix="/api/photos", tags=["photos"])


@router.get("", response_model=list[PhotoResponse])
async def list_photos(
    limit: int = Query(50, ge=1, le=100),
    service: PhotoService = Depends(),
):
    return await service.get_gallery(limit=limit)
