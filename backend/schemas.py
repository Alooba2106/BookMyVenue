from datetime import date, time
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class VenueCreate(BaseModel):
    owner_id: int
    name: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    image: str = Field(..., min_length=1)
    amenities: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    slot_template: str = Field(..., min_length=1)
    price: int = Field(..., gt=0)
    capacity: int = Field(..., gt=0)
    status: bool


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    capacity: Optional[int] = None
    status: Optional[bool] = None
    image: Optional[str] = None
    amenities: Optional[str] = None
    description: Optional[str] = None
    slot_template: Optional[str] = None


class BookingCreate(BaseModel):
    venue_id: int
    event_date: date
    guests: int
    advance_amount: int
    slot_id: int

    @field_validator("event_date")
    @classmethod
    def validate_event_date(cls, value):
        if value < date.today():
            raise ValueError("Event date cannot be in the past")
        return value


class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class OwnerCreate(BaseModel):
    name: str
    email: str
    password: str


class OwnerLogin(BaseModel):
    email: str
    password: str


class SlotCreate(BaseModel):
    venue_id: int
    slot_name: str
    start_time: time
    end_time: time


class BlockedDateCreate(BaseModel):
    venue_id: int
    blocked_date: date
    reason: str


class PaymentOrderCreate(BaseModel):
    amount: int


class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    venue_id: int
    event_date: date
    guests: int
    amount: int
    slot_id: int