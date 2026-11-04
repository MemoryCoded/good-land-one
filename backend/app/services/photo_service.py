from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.photo_repository import PhotoRepository
from app.repositories.collection_repository import CollectionRepository
from app.schemas.photo import PhotoResponse


class PhotoService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
        self.photo_repo = PhotoRepository(db)
        self.collection_repo = CollectionRepository(db)

    async def get_gallery(self, limit: int = 50) -> list[PhotoResponse]:
        photos = await self.photo_repo.get_published_photos(limit=limit)
        return [
            PhotoResponse.model_validate(
                {
                    **photo.__dict__,
                    "collection_name": photo.collection.name
                    if photo.collection
                    else None,
                    "collection_sort_order": photo.collection.sort_order
                    if photo.collection
                    else None,
                }
            )
            for photo in photos
        ]

    async def get_admin_library(
        self, skip: int = 0, limit: int = 100
    ) -> list[PhotoResponse]:
        photos = await self.photo_repo.get_paginated_photos(skip=skip, limit=limit)
        return [
            PhotoResponse.model_validate(
                {
                    **photo.__dict__,
                    "collection_name": photo.collection.name
                    if photo.collection
                    else None,
                    "collection_sort_order": photo.collection.sort_order
                    if photo.collection
                    else None,
                }
            )
            for photo in photos
        ]

    async def update_photo_metadata(self, photo_id: int, update_data: dict):
        try:
            new_collection_name = update_data.pop("new_collection_name", None)

            # 1. Handle the new collection name
            if new_collection_name:
                clean_name = new_collection_name.strip()
                if clean_name:  # Ensure it's not empty
                    existing = await self.collection_repo.get_by_name(clean_name)
                    if existing:
                        update_data["collection_id"] = existing.id
                    else:
                        # This creates the collection and safely handles special characters
                        new_col = await self.collection_repo.create_collection(
                            clean_name
                        )
                        update_data["collection_id"] = new_col.id

            # 2. Update the photo
            updated_photo = await self.photo_repo.update_photo(photo_id, update_data)
            if not updated_photo:
                raise ValueError(f"Photo {photo_id} not found")

            await self.db.commit()

            # 3. Refresh to get the new collection relationship
            await self.db.refresh(updated_photo, ["collection"])

            return updated_photo
        except Exception as e:
            await self.db.rollback()
            raise e
