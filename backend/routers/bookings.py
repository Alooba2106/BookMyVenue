from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from auth import get_db, get_current_user
from models.booking import Booking
from models.venue import Venue
from models.slot import Slot
from models.user import User
from schemas import BookingCreate

router = APIRouter(tags=["Bookings"])



@router.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings


@router.post("/bookings")
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    venue = db.query(Venue).filter(Venue.id == booking.venue_id).first()

    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found")

    if booking.guests > venue.capacity:
        raise HTTPException(
            status_code=400,
            detail="Guests exceed venue capacity"
        )

    existing_booking = db.query(Booking).filter(
        Booking.venue_id == booking.venue_id,
        Booking.event_date == booking.event_date,
        Booking.slot_id == booking.slot_id,
        Booking.booking_status != "cancelled"
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=400,
            detail="This slot is already booked"
        )

    new_booking = Booking(
        user_id=current_user.id,
        venue_id=booking.venue_id,
        event_date=booking.event_date,
        guests=booking.guests,
        slot_id=booking.slot_id,
        advance_amount=booking.advance_amount,
        booking_status="confirmed"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking

@router.get("/my-bookings")
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = (
        db.query(Booking, Venue, Slot)
        .join(Venue, Booking.venue_id == Venue.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .filter(Booking.user_id == current_user.id)
        .all()
    )

    result = []

    for booking, venue, slot in bookings:
        result.append({
            "booking_id": booking.id,
            "venue_name": venue.name,
            "event_date": booking.event_date,
            "slot_name": slot.slot_name,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "guests": booking.guests,
            "advance_amount": booking.advance_amount,
            "booking_status": booking.booking_status
        })

    return result


@router.put("/bookings/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.booking_status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking already cancelled"
        )

    today = date.today()

    days_left = (booking.event_date - today).days

    if days_left < 7:
        raise HTTPException(
            status_code=400,
            detail="Cancellation allowed only 7 days before event date"
        )

    booking.booking_status = "cancelled"

    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking cancelled successfully",
        "id": booking.id,
        "booking_status": booking.booking_status
    }
