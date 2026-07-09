from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import owners
from routers import bookings
from routers import venues
from routers import slots
from routers import blocked_dates
from routers import payments
from routers import admin
from routers import users
from database import engine, Base


app = FastAPI()
#Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    
         "https://book-my-venue-2v9wfh0uw-alooba.vercel.app",
         "https://book-my-venue-cz3cooio8-alooba.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(owners.router)
app.include_router(users.router)
app.include_router(bookings.router)
app.include_router(venues.router)
app.include_router(slots.router)
app.include_router(blocked_dates.router)
app.include_router(admin.router)
app.include_router(payments.router)


@app.get("/")
def home():
    return {"message": "BookMyVenue backend is running"}