from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.analytics import (
    get_average_scores,
    get_block_summary,
    get_priority_schools,
    get_school_count,
    get_total_students,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):
    return {
        "school_count": get_school_count(db),
        "total_students": get_total_students(db),
        "average_scores": get_average_scores(db),
        "priority_schools": get_priority_schools(
            db,
            limit=5,
        ),
        "block_summary": get_block_summary(db),
    }