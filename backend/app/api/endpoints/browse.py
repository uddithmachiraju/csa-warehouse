from fastapi import APIRouter, HTTPException
from app.services.storage.mongodb_service import get_data_from_collection

browser_router = APIRouter()

@browser_router.get("/browse")
async def browse_datasets():
    data = get_data_from_collection()
    return {"status": "success", "data": data}
