from sqlalchemy import Column, Integer, String ,ForeignKey,Date
from database import Base




class Booking(Base):
     __tablename__ = "bookings"

     id = Column(Integer,primary_key = True, index =True)
     user_id = Column(Integer)
     venue_id = Column(Integer)
     event_date= Column(Date)
     guests=Column(Integer)
     advance_amount= Column(Integer)
     booking_status= Column(String(50),default="pending")