from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.analytics import (
    get_block_priority_summary,
    get_school_by_id,
)


router = APIRouter(
    prefix="/api/insights",
    tags=["Insights"],
)


@router.get("/school/{school_id}")
def school_insight(
    school_id: str,
    db: Session = Depends(get_db),
):
    school = get_school_by_id(
        db,
        school_id,
    )

    if school is None:
        raise HTTPException(
            status_code=404,
            detail=f"School {school_id} not found.",
        )

    return {
        "school": school,
    }


@router.get("/blocks/priority")
def block_priority(
    db: Session = Depends(get_db),
):
    return {
        "blocks": get_block_priority_summary(db),
    }