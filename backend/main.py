from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import date 
from database import SessionLocal
from models.venue import Venue
from models.booking import Booking
from pydantic import BaseModel,field_validator
from fastapi import HTTPException

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class VenueCreate(BaseModel):
    name: str
    location: str
    price: int
    capacity: int
    status : bool
    image: str
    description: str

class BookingCreate(BaseModel):
    user_id:int
    venue_id:int
    event_date : date
    guests:int
    advance_amount:int
    @field_validator("event_date")
    @classmethod
    def validate_event_date(cls, value):
        if value < date.today():
            raise ValueError("Event date cannot be in the past")
        return value
    

@app.get("/")
def home():
    return {"message": "BookMyVenue backend is running"}

@app.get("/venues")
def get_venues(db: Session = Depends(get_db)):
    venues = db.query(Venue).all()
    return venues
@app.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings
@app.get("/venues/{venue_id}")
def get_venue(venue_id:int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()
    return venue
    
@app.get("/filter")
def get_filter(db: Session = Depends(get_db)):
    venues = db.query(Venue).filter(
    Venue.location == "Calicut"
    ).all()
    return venues
@app.post("/venues")
def create_venue(venue: VenueCreate, db: Session = Depends(get_db)):
    new_venue = Venue(
        name=venue.name,
        location=venue.location,
        price=venue.price,
        capacity=venue.capacity,
        status=venue.status,
        image=venue.image,
        description=venue.description
    )

    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)

    return new_venue
@app.post("/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    new_booking= Booking(
        user_id = booking.user_id,
        venue_id = booking.venue_id,
        event_date =booking.event_date,
        guests=booking.guests,
        advance_amount = booking.advance_amount,
        booking_status="pending"
       
    )
    venue = db.query(Venue).filter(
    Venue.id == booking.venue_id
    ).first()

    if booking.guests > venue.capacity:
        return {
        "message": "Guests exceed venue capacity"
        }
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@app.put("/venues/{venue_id}")
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
    venue.status = updated_venue.status

    db.commit()
    db.refresh(venue)

    return venue
@app.put("/bookings/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        return {"message": "Booking not found"}

    booking.booking_status = "cancelled"

    db.commit()
    db.refresh(booking)

    return booking