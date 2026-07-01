from sqlalchemy import Column, Integer, Date, String, ForeignKey
from database import Base

class BlockedDate(Base):
    __tablename__ = "blocked_dates"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id", ondelete="CASCADE"))
    blocked_date = Column(Date, nullable=False)
    reason = Column(String(255))