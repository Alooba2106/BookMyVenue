from sqlalchemy import Column, Integer, String ,ForeignKey,Date
from database import Base


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    price = Column(Integer)
    capacity = Column(Integer)
    status = Column(String)
    image = Column(String)
    description = Column(String)
    

