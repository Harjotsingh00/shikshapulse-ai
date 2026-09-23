from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from .database import Base


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)

    school_id = Column(String(50), unique=True, nullable=False, index=True)
    school_name = Column(String(200), nullable=False)

    district = Column(String(100), nullable=False, index=True)
    block = Column(String(100), nullable=False, index=True)

    enrollment = Column(Integer, default=0)
    teachers = Column(Integer, default=0)

    attendance_rate = Column(Float, default=0.0)

    infrastructure_score = Column(Float, default=0.0)
    teacher_training_score = Column(Float, default=0.0)

    numeracy_score = Column(Float, default=0.0)
    literacy_score = Column(Float, default=0.0)

    dropout_rate = Column(Float, default=0.0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Action(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)

    school_id = Column(
        String(50),
        nullable=False,
        index=True,
    )

    identified_gap = Column(
        String(300),
        nullable=False,
    )

    recommended_action = Column(
        Text,
        nullable=False,
    )

    owner = Column(
        String(200),
        nullable=False,
    )

    deadline = Column(
        String(50),
        nullable=False,
    )

    status = Column(
        String(50),
        default="Planned",
    )

    outcome = Column(
        Text,
        default="",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )