from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Action
from ..schemas import (
    ActionCreate,
    ActionUpdate,
)


router = APIRouter(
    prefix="/api/actions",
    tags=["Actions"],
)


@router.post("/")
def create_action(
    action_data: ActionCreate,
    db: Session = Depends(get_db),
):
    action = Action(
        school_id=action_data.school_id,
        identified_gap=action_data.identified_gap,
        recommended_action=(
            action_data.recommended_action
        ),
        owner=action_data.owner,
        deadline=action_data.deadline,
        status="Planned",
        outcome="",
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    return {
        "message": "Action created successfully.",
        "action": {
            "id": action.id,
            "school_id": action.school_id,
            "identified_gap": action.identified_gap,
            "recommended_action": (
                action.recommended_action
            ),
            "owner": action.owner,
            "deadline": action.deadline,
            "status": action.status,
            "outcome": action.outcome,
        },
    }


@router.get("/")
def get_actions(
    db: Session = Depends(get_db),
):
    actions = (
        db.query(Action)
        .order_by(Action.id.desc())
        .all()
    )

    return {
        "count": len(actions),
        "actions": [
            {
                "id": action.id,
                "school_id": action.school_id,
                "identified_gap": (
                    action.identified_gap
                ),
                "recommended_action": (
                    action.recommended_action
                ),
                "owner": action.owner,
                "deadline": action.deadline,
                "status": action.status,
                "outcome": action.outcome,
            }
            for action in actions
        ],
    }


@router.get("/{action_id}")
def get_action(
    action_id: int,
    db: Session = Depends(get_db),
):
    action = (
        db.query(Action)
        .filter(Action.id == action_id)
        .first()
    )

    if not action:
        raise HTTPException(
            status_code=404,
            detail="Action not found.",
        )

    return {
        "id": action.id,
        "school_id": action.school_id,
        "identified_gap": action.identified_gap,
        "recommended_action": (
            action.recommended_action
        ),
        "owner": action.owner,
        "deadline": action.deadline,
        "status": action.status,
        "outcome": action.outcome,
    }


@router.patch("/{action_id}")
def update_action(
    action_id: int,
    action_data: ActionUpdate,
    db: Session = Depends(get_db),
):
    action = (
        db.query(Action)
        .filter(Action.id == action_id)
        .first()
    )

    if not action:
        raise HTTPException(
            status_code=404,
            detail="Action not found.",
        )

    updates = action_data.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(
            action,
            field,
            value,
        )

    db.commit()
    db.refresh(action)

    return {
        "message": "Action updated successfully.",
        "action": {
            "id": action.id,
            "school_id": action.school_id,
            "identified_gap": action.identified_gap,
            "recommended_action": (
                action.recommended_action
            ),
            "owner": action.owner,
            "deadline": action.deadline,
            "status": action.status,
            "outcome": action.outcome,
        },
    }


@router.delete("/{action_id}")
def delete_action(
    action_id: int,
    db: Session = Depends(get_db),
):
    action = (
        db.query(Action)
        .filter(Action.id == action_id)
        .first()
    )

    if not action:
        raise HTTPException(
            status_code=404,
            detail="Action not found.",
        )

    db.delete(action)
    db.commit()

    return {
        "message": "Action deleted successfully.",
        "action_id": action_id,
    }