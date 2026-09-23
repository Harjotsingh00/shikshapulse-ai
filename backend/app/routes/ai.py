from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.ai_engine import ask_education_ai
from ..services.ollama_service import check_ollama_health


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Intelligence"],
)


class AIQuestion(BaseModel):
    question: str


@router.get("/health")
def ai_health():
    return check_ollama_health()


@router.post("/ask")
def ask_ai(
    request: AIQuestion,
    db: Session = Depends(get_db),
):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:
        return ask_education_ai(
            db,
            question,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(exc)}",
        ) from exc