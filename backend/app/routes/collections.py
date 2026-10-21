from fastapi import APIRouter, Depends

from app.schemas.collection import CollectionResponse
from app.services.collection_service import CollectionService

# Api router is used to define the API endpoints for the collections.
# It is a way to group related endpoints together and provide a common prefix for the routes.
# tag is used to group the endpoints in the API documentation. It allows for better organization and navigation of the API documentation.
router = APIRouter(prefix="/api/collections", tags=["collections"])


# response_model is
@router.get("", response_model=list[CollectionResponse])
async def list_collections(service: CollectionService = Depends()):
    return await service.get_all_collections()
