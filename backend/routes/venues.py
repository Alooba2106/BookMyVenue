from fastapi import APIRouter
router = APIRouter(prefix="/api/venues", tags=["Venues"])

@router.get("/")
def get_venues():
    return {"message": "Venue routes working"}