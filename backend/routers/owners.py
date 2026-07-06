from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_db, create_access_token, get_current_owner, pwd_context
from schemas import OwnerCreate, OwnerLogin
from models.owner import Owner
from models.venue import Venue
from models.booking import Booking
from models.user import User
from models.slot import Slot
from schemas import VenueUpdate


router = APIRouter(tags=["Owners"])



@router.post("/owners")
def create_owner(owner: OwnerCreate, db: Session = Depends(get_db)):
    existing_owner = db.query(Owner).filter(Owner.email == owner.email).first()

    if existing_owner:
        raise HTTPException(status_code=400, detail="Owner already exists")

    new_owner = Owner(
        name=owner.name,
        email=owner.email,
        password=pwd_context.hash(owner.password),
        is_approved=False
    )

    db.add(new_owner)
    db.commit()
    db.refresh(new_owner)

    return {
        "message": "Owner registered successfully. Waiting for admin approval.",
        "owner_id": new_owner.id,
        "name": new_owner.name,
        "email": new_owner.email,
        "is_approved": new_owner.is_approved
    }


@router.post("/owners/login")
def owner_login(owner_data: OwnerLogin, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.email == owner_data.email).first()

    if not owner:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(owner_data.password, owner.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if owner.is_approved == False:
        raise HTTPException(status_code=403, detail="Owner not approved yet")

    access_token = create_access_token(
        data={
            "sub": owner.email,
            "owner_id": owner.id,
            "role": "owner"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "owner_id": owner.id
    }


@router.get("/owners/my-venues")
def get_my_venues(
    current_owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    venues = db.query(Venue).filter(
        Venue.owner_id == current_owner.id
    ).all()

    return venues


@router.get("/owners/{owner_id}/venues")
def get_owner_venues(owner_id: int, db: Session = Depends(get_db)):
    venues = db.query(Venue).filter(Venue.owner_id == owner_id).all()
    return venues


@router.put("/owners/{owner_id}/venues/{venue_id}")
def update_owner_venue(
    owner_id: int,
    venue_id: int,
    venue: VenueUpdate,
    db: Session = Depends(get_db)
):
    existing_venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == owner_id
    ).first()

    if not existing_venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    update_data = venue.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(existing_venue, key, value)

    db.commit()
    db.refresh(existing_venue)

    return existing_venue


@router.delete("/owners/{owner_id}/venues/{venue_id}")
def owner_delete_venue(
    owner_id: int,
    venue_id: int,
    db: Session = Depends(get_db)
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == owner_id
    ).first()

    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found for this owner")

    existing_booking = db.query(Booking).filter(
        Booking.venue_id == venue_id
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete venue because it has bookings"
        )

    db.delete(venue)
    db.commit()

    return {"message": "Venue deleted successfully"}


@router.get("/owners/{owner_id}/bookings")
def get_owner_bookings_by_owner_id(
    owner_id: int,
    db: Session = Depends(get_db)
):
    bookings = (
        db.query(Booking, User, Venue, Slot)
        .join(User, Booking.user_id == User.id)
        .join(Venue, Booking.venue_id == Venue.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .filter(Venue.owner_id == owner_id)
        .all()
    )

    result = []

    for booking, user, venue, slot in bookings:
        result.append({
            "id": booking.id,
            "customer_name": user.name,
            "venue_name": venue.name,
            "slot_name": slot.slot_name,
            "event_date": booking.event_date,
            "guests": booking.guests,
            "advance_amount": booking.advance_amount,
            "booking_status": booking.booking_status,
        })

    return result


@router.get("/owner/bookings")
def get_current_owner_bookings(
    db: Session = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    bookings = (
        db.query(Booking, Venue, User, Slot)
        .join(Venue, Booking.venue_id == Venue.id)
        .join(User, Booking.user_id == User.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .filter(Venue.owner_id == current_owner.id)
        .all()
    )

    result = []

    for booking, venue, user, slot in bookings:
        result.append({
            "id": booking.id,
            "venue_name": venue.name,
            "customer_name": user.name,
            "customer_email": user.email,
            "event_date": booking.event_date,
            "slot_name": slot.slot_name,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "guests": booking.guests,
            "advance_amount": booking.advance_amount,
            "booking_status": booking.booking_status
        })

    return result