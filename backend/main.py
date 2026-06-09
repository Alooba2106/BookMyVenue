from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.venue import Venue

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "BookMyVenue backend is running"}

@app.get("/venues")
def get_venues(db: Session = Depends(get_db)):
    venues = db.query(Venue).all()
    return venues
@app.get("/filter")
def get_filter(db: Session = Depends(get_db)):
    venues = db.query(Venue).filter(
    Venue.location == "Calicut"
    ).all()
    return venues