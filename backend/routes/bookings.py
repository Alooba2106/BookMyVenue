from fastapi import APIRouter

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.get("/")
def get_bookings():
    return {"message": "Booking routes working"}