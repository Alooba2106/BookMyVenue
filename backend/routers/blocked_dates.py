from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_db
from models.blocked_dates import BlockedDate
from schemas import BlockedDateCreate

router = APIRouter(tags=["Blocked Dates"])


@router.post("/blocked-dates")
def create_blocked_date(
    blocked: BlockedDateCreate,
    db: Session = Depends(get_db)
):
    new_blocked_date = BlockedDate(
        venue_id=blocked.venue_id,
        blocked_date=blocked.blocked_date,
        reason=blocked.reason
    )

    db.add(new_blocked_date)
    db.commit()
    db.refresh(new_blocked_date)

    return new_blocked_date


@router.get("/venues/{venue_id}/blocked-dates")
def get_blocked_dates(
    venue_id: int,
    db: Session = Depends(get_db)
):
    blocked_dates = db.query(BlockedDate).filter(
        BlockedDate.venue_id == venue_id
    ).all()

    return blocked_dates