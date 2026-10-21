from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.collection_repository import CollectionRepository
from app.schemas.collection import CollectionResponse


class CollectionService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        # .repo is an attribute of the CollectionService class that holds an instance of the CollectionRepository class.
        self.repo = CollectionRepository(db)

    async def get_all_collections(self) -> list[CollectionResponse]:
        collections = await self.repo.get_all_collections()
        # .model_validate is a method of the CollectionResponse class that takes an instance of the Collection model and returns an instance of the CollectionResponse schema.
        # It is used to convert the data from the database model to the API response schema.
        return [CollectionResponse.model_validate(c) for c in collections]
