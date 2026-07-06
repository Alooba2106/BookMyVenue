
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_db
from models.slot import Slot
from models.booking import Booking
from schemas import SlotCreate

router = APIRouter(tags=["Slots"])



@router.post("/slots")
def create_slot(slot: SlotCreate, db: Session = Depends(get_db)):

    existing_slot = db.query(Slot).filter(
         Slot.venue_id == slot.venue_id,
         Slot.start_time == slot.start_time,
        Slot.end_time == slot.end_time
    ).first()

    if existing_slot:
        raise HTTPException(
            status_code=400,
            detail="This slot already exists for this venue"
        )

    new_slot = Slot(
        venue_id=slot.venue_id,
        slot_name=slot.slot_name,
        start_time=slot.start_time,
        end_time=slot.end_time
    )

    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)

    return new_slot
@router.get("/venues/{venue_id}/slots")
def get_venue_slots(venue_id: int, db: Session = Depends(get_db)):
    slots = db.query(Slot).filter(Slot.venue_id == venue_id).all()
    return slots

@router.get("/venues/{venue_id}/slots-with-status")
def get_slots_with_status(
    venue_id: int,
    event_date: date,
    db: Session = Depends(get_db)
):
    slots = db.query(Slot).filter(Slot.venue_id == venue_id).all()

    result = []

    for slot in slots:
        existing_booking = db.query(Booking).filter(
            Booking.venue_id == venue_id,
            Booking.event_date == event_date,
            Booking.slot_id == slot.id,
            Booking.booking_status != "cancelled"
        ).first()

        result.append({
            "id": slot.id,
            "venue_id": slot.venue_id,
            "slot_name": slot.slot_name,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "is_booked": existing_booking is not None
        })

    return result