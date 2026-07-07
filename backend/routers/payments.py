from datetime import date
import hmac
import hashlib
import razorpay

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_db, get_current_user
from models.user import User
from models.booking import Booking
from schemas import PaymentOrderCreate, VerifyPaymentRequest
import os

router = APIRouter(tags=["Payments"])



RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_SECRET")


razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


@router.post("/payments/create-order")
def create_payment_order(
    payment: PaymentOrderCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        order_data = {
            "amount": payment.amount * 100,
            "currency": "INR",
            "payment_capture": 1,
        }

        order = razorpay_client.order.create(data=order_data)

        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify-payment")
def verify_payment(
    data: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != data.razorpay_signature:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    new_booking = Booking(
        user_id=current_user.id,
        venue_id=data.venue_id,
        event_date=data.event_date,
        guests=data.guests,
        advance_amount=data.amount,
        slot_id=data.slot_id,
        booking_status="confirmed"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return {
        "message": "Booking confirmed",
        "booking_id": new_booking.id
    }