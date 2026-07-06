from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_db
from models.owner import Owner

router = APIRouter(tags=["Admin"])



@router.get("/owners/pending")
def get_pending_owners(db: Session = Depends(get_db)):
    owners = db.query(Owner).filter(
        Owner.is_approved == False
    ).all()

    return owners

@router.put("/owners/{owner_id}/approve")
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