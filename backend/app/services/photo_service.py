from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.photo_repository import PhotoRepository
from app.schemas.photo import PhotoResponse


# Services contain the business logic of the application.
# They orchestrate the flow of data between the routes and the repositories.
# Services can also perform additional validation, transformation, or other operations on the data before returning it to the routes.
class PhotoService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.repo = PhotoRepository(db)

    async def get_gallery(self, limit: int = 50) -> list[PhotoResponse]:
        photos = await self.repo.get_published_photos(limit=limit)
        return [PhotoResponse.model_validate(photo) for photo in photos]
