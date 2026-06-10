from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.venue import Venue
from pydantic import BaseModel

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

@app.get("/")
def home():
    return {"message": "BookMyVenue backend is running"}

@app.get("/venues")
def get_venues(db: Session = Depends(get_db)):
    venues = db.query(Venue).all()
    return venues
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