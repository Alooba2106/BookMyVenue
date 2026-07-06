
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_db
from models.venue import Venue
from models.slot import Slot
from schemas import VenueCreate, VenueUpdate

router = APIRouter(tags=["Venues"])






@router.get("/venues")
def get_venues(db: Session = Depends(get_db)):
    venues = db.query(Venue).all()
    return venues

@router.get("/venues/{venue_id}")
def get_venue(venue_id:int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()
    return venue

@router.post("/venues")
def create_venue(venue: VenueCreate, db: Session = Depends(get_db)):
    new_venue = Venue(
        owner_id=venue.owner_id,
        name=venue.name,
        location=venue.location,
        category=venue.category,
        price=venue.price,
        capacity=venue.capacity,
        status=venue.status,
        image=venue.image,
        amenities=venue.amenities,
        description=venue.description
    )

    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)

    if venue.slot_template == "full_day":
        slot = Slot(
            venue_id=new_venue.id,
            slot_name="Full Day",
            start_time="09:00",
            end_time="22:00"
        )
        db.add(slot)

    elif venue.slot_template == "half_day":
        morning = Slot(
                venue_id=new_venue.id,
                slot_name="Morning Slot",
                start_time="09:00",
                end_time="13:00"
        )

        evening = Slot(
            venue_id=new_venue.id,
            slot_name="Evening Slot",
            start_time="17:00",
            end_time="22:00"
        )

        db.add(morning)
        db.add(evening)

    db.commit()

    return new_venue

@router.put("/venues/{venue_id}")
def update_venue(
    venue_id: int,
    updated_venue: VenueCreate,
    db: Session = Depends(get_db)
    ):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if venue is None:
        return {"message": "Venue not found"}

    venue.name = updated_venue.name
    venue.location = updated_venue.location
    venue.price = updated_venue.price
    venue.capacity = updated_venue.capacity
    venue.amenities = updated_venue.amenities
    venue.status = updated_venue.status

    db.commit()
    db.refresh(venue)

    return venue