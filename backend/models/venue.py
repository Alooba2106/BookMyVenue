from sqlalchemy import Column, Integer, String ,ForeignKey,Date,Text
from database import Base


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"))
    name = Column(String)
    location = Column(String)
    category = Column(String)
    price = Column(Integer)
    capacity = Column(Integer)
    status = Column(String)
    image = Column(String)
    amenities = Column(Text)
    description = Column(String)
    slot_template = Column(String(50))
    

