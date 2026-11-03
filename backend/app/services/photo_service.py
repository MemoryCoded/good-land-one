from fastapi import Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.photo_repository import PhotoRepository
from app.repositories.collection_repository import CollectionRepository
from app.schemas.photo import PhotoResponse
from app.services.image_service import process_and_save_image
import asyncio


# Services contain the business logic of the application.
# They orchestrate the flow of data between the routes and the repositories.
# Services can also perform additional validation, transformation, or other operations on the data before returning it to the routes.
class PhotoService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
        self.photo_repo = PhotoRepository(db)
        self.collection_repo = CollectionRepository(db)

    async def get_gallery(self, limit: int = 50) -> list[PhotoResponse]:
        photos = await self.repo.get_published_photos(limit=limit)
        return [PhotoResponse.model_validate(photo) for photo in photos]

    async def process_upload_batch(
        self,
        files: list[UploadFile],
        collection_id: int,
        is_archived: bool,
        in_gallery: bool,
        is_uncategorized: bool,
    ) -> int:
        # Use collection repo to check if it exists (implicit transac start)
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise ValueError(f"Collection {collection_id} does not exist.")

        processed_data = []

        # Process images
        for file in files:
            raw = await file.read()
            meta = await asyncio.to_thread(process_and_save_image, raw, file.filename)

            processed_data.append((meta, len(raw)))

            # Save to DB using Photo Repo
            try:
                max_pos = await self.photo_repo.get_max_position(collection_id)

                for meta, file_size in processed_data:
                    max_pos += 1  # Increment for next photo

                    photo_data = {
                        "collection_id": collection_id,
                        "position": max_pos,
                        "filename": meta["filename"],
                        "thumbnail_small": meta["thumb_small"],
                        "thumbnail_medium": meta["thumb_medium"],
                        "thumbnail_large": meta["thumb_large"],
                        "width": meta["width"],
                        "height": meta["height"],
                        "mime_type": meta["mime_type"],
                        "size_bytes": file_size,
                        "date_taken": meta.get("date_taken"),
                        "is_archived": is_archived,
                        "in_gallery": in_gallery,
                        "is_uncategorized": is_uncategorized,
                    }

                    await self.photo_repo.create_photo(photo_data)
                # Commit
                await self.db.commit()

            except Exception as e:
                await self.db.rollback()
                raise e

            return len(processed_data)

    async def get_admin_library(
        self, skip: int = 0, limit: int = 100
    ) -> list[PhotoResponse]:
        photos = await self.photo_repo.get_paginated_photos(skip=skip, limit=limit)
        return [PhotoResponse.model_validate(photo) for photo in photos]
