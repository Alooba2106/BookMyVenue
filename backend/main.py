from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import date 
from database import SessionLocal
from models.venue import Venue
from models.booking import Booking
from models.owner import Owner
from models.user import User
from pydantic import BaseModel,field_validator
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException
from models.slot import Slot
from datetime import date,time, timedelta
from models.blocked_dates import BlockedDate
import razorpay
import hmac
import hashlib
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = "bookmyvenue_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login"
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt
class VenueCreate(BaseModel):
    owner_id:int
    name: str
    location: str
    category: str
    price: int
    capacity: int
    status : bool
    image: str
    amenities: str
    description: str
    slot_template: str

class BookingCreate(BaseModel):
    venue_id:int
    event_date : date
    guests:int
    advance_amount:int
    slot_id:int
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
@app.post("/bookings")
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
@app.get("/my-bookings")
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()

    return bookings
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
    venue.amenities = updated_venue.amenities
    venue.status = updated_venue.status

    db.commit()
    db.refresh(venue)

    return venue


    
@app.get("/owners/pending")
def get_pending_owners(db: Session = Depends(get_db)):
    owners = db.query(Owner).filter(
        Owner.is_approved == False
    ).all()

    return owners

@app.put("/owners/{owner_id}/approve")
def approve_owner(owner_id: int, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(
        Owner.id == owner_id
    ).first()

    if owner is None:
        return {"message": "Owner not found"}

    owner.is_approved = True

    db.commit()
    db.refresh(owner)

    return owner

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

@app.post("/users/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}
class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/users/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={
            "sub": existing_user.email,
            "user_id": existing_user.id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
@app.get("/users/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

class OwnerCreate(BaseModel):
    name: str
    email: str
    password: str
@app.post("/owners")
def create_owner(owner: OwnerCreate, db: Session = Depends(get_db)):
    existing_owner = db.query(Owner).filter(Owner.email == owner.email).first()

    if existing_owner:
        raise HTTPException(status_code=400, detail="Owner already exists")

    hashed_password = pwd_context.hash(owner.password)

    new_owner = Owner(
        name=owner.name,
        email=owner.email,
        password=hashed_password,
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
class OwnerLogin(BaseModel):
    email: str
    password: str

@app.post("/owners/login")
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
        "owner_id" : owner.id
    }
def get_current_owner(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    owner = db.query(Owner).filter(Owner.email == email).first()

    if owner is None:
        raise HTTPException(status_code=401, detail="Owner not found")

    return owner
@app.get("/owners/my-venues")
def get_my_venues(
    current_owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    venues = db.query(Venue).filter(
        Venue.owner_id == current_owner.id
    ).all()

    return venues


@app.get("/owners/{owner_id}/venues")
def get_owner_venues(owner_id: int, db: Session = Depends(get_db)):
    venues = db.query(Venue).filter(Venue.owner_id == owner_id).all()
    return venues
@app.put("/owners/{owner_id}/venues/{venue_id}")
def owner_update_venue(
    owner_id: int,
    venue_id: int,
    updated_venue: VenueCreate,
    db: Session = Depends(get_db)
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == owner_id
    ).first()

    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found for this owner")

    venue.name = updated_venue.name
    venue.location = updated_venue.location
    venue.category = updated_venue.category
    venue.price = updated_venue.price
    venue.capacity = updated_venue.capacity
    venue.status = updated_venue.status
    venue.image = updated_venue.image
    venue.amenities = updated_venue.amenities
    venue.description = updated_venue.description

    db.commit()
    db.refresh(venue)

    return venue
@app.delete("/owners/{owner_id}/venues/{venue_id}")
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

@app.get("/owners/{owner_id}/bookings")
def get_owner_bookings(owner_id: int, db: Session = Depends(get_db)):
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
class SlotCreate(BaseModel):
    venue_id: int
    slot_name: str
    start_time: time
    end_time: time
@app.post("/slots")
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
@app.get("/venues/{venue_id}/slots")
def get_venue_slots(venue_id: int, db: Session = Depends(get_db)):
    slots = db.query(Slot).filter(Slot.venue_id == venue_id).all()
    return slots

@app.get("/venues/{venue_id}/slots-with-status")
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

class BlockedDateCreate(BaseModel):
    venue_id: int
    blocked_date: date
    reason: str

@app.post("/blocked-dates")
def create_blocked_date(blocked: BlockedDateCreate, db: Session = Depends(get_db)):
    new_blocked_date = BlockedDate(
        venue_id=blocked.venue_id,
        blocked_date=blocked.blocked_date,
        reason=blocked.reason
    )

    db.add(new_blocked_date)
    db.commit()
    db.refresh(new_blocked_date)

    return new_blocked_date


@app.get("/venues/{venue_id}/blocked-dates")
def get_blocked_dates(venue_id: int, db: Session = Depends(get_db)):
    blocked_dates = db.query(BlockedDate).filter(
        BlockedDate.venue_id == venue_id
    ).all()

    return blocked_dates
@app.get("/my-bookings")
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

@app.put("/bookings/{booking_id}/cancel")
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


@app.get("/owner/bookings")
def get_owner_bookings(
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


RAZORPAY_KEY_ID = "rzp_test_T7rqnM98YWZ5z8"
RAZORPAY_KEY_SECRET = "P0ZbNDRqRl59NxjUxj65ZV4K"

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

class PaymentOrderCreate(BaseModel):
    amount: int

class PaymentOrderCreate(BaseModel):
    amount: int


class PaymentOrderCreate(BaseModel):
    amount: int


@app.post("/payments/create-order")
def create_payment_order(
    payment: PaymentOrderCreate,
    current_user: User = Depends(get_current_user)
):
    print("CREATE ORDER CALLED")
    print("AMOUNT:", payment.amount)
    print("USER:", current_user.email)

    try:
        order_data = {
            "amount": payment.amount * 100,
            "currency": "INR",
            "payment_capture": 1,
        }

        order = razorpay_client.order.create(data=order_data)

        print("ORDER CREATED:", order)

        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID,
        }

    except Exception as e:
        print("RAZORPAY ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))