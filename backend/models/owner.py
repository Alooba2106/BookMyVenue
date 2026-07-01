from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    is_approved = Column(Boolean, default=False)