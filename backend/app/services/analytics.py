from sqlalchemy.orm import Session

from ..models import School


def get_school_count(db: Session) -> int:
    return db.query(School).count()


def get_total_students(db: Session) -> int:
    schools = db.query(School).all()

    return sum(
        school.enrollment
        for school in schools
    )


def get_average_scores(db: Session) -> dict:
    schools = db.query(School).all()

    if not schools:
        return {
            "numeracy": 0,
            "literacy": 0,
            "attendance": 0,
            "dropout": 0,
        }

    return {
        "numeracy": round(
            sum(s.numeracy_score for s in schools)
            / len(schools),
            1,
        ),
        "literacy": round(
            sum(s.literacy_score for s in schools)
            / len(schools),
            1,
        ),
        "attendance": round(
            sum(s.attendance_rate for s in schools)
            / len(schools),
            1,
        ),
        "dropout": round(
            sum(s.dropout_rate for s in schools)
            / len(schools),
            1,
        ),
    }


def calculate_priority_score(school: School) -> float:
    """
    Prototype prioritization heuristic.

    Higher score = greater need for attention.

    This is NOT an official government formula.
    """

    learning_gap = (
        100 - school.numeracy_score
    )

    affected_population = min(
        school.enrollment / 250 * 100,
        100,
    )

    system_risk = (
        (
            100 - school.teacher_training_score
        )
        +
        (
            100 - school.infrastructure_score
        )
    ) / 2

    attendance_risk = 100 - school.attendance_rate

    priority_score = (
        learning_gap * 0.45
        + affected_population * 0.20
        + attendance_risk * 0.15
        + system_risk * 0.20
    )

    return round(priority_score, 2)


def get_priority_schools(
    db: Session,
    limit: int = 5,
) -> list[dict]:

    schools = db.query(School).all()

    results = []

    for school in schools:

        priority_score = calculate_priority_score(
            school
        )

        results.append(
            {
                "school_id": school.school_id,
                "school_name": school.school_name,
                "block": school.block,
                "numeracy_score": school.numeracy_score,
                "literacy_score": school.literacy_score,
                "attendance_rate": school.attendance_rate,
                "teacher_training_score": (
                    school.teacher_training_score
                ),
                "infrastructure_score": (
                    school.infrastructure_score
                ),
                "dropout_rate": school.dropout_rate,
                "enrollment": school.enrollment,
                "priority_score": priority_score,
            }
        )

    results.sort(
        key=lambda x: x["priority_score"],
        reverse=True,
    )

    return results[:limit]


def get_block_summary(
    db: Session,
) -> list[dict]:

    schools = db.query(School).all()

    blocks = {}

    for school in schools:

        if school.block not in blocks:
            blocks[school.block] = {
                "block": school.block,
                "schools": 0,
                "students": 0,
                "numeracy_total": 0,
                "literacy_total": 0,
                "attendance_total": 0,
                "dropout_total": 0,
            }

        block = blocks[school.block]

        block["schools"] += 1
        block["students"] += school.enrollment

        block["numeracy_total"] += (
            school.numeracy_score
        )

        block["literacy_total"] += (
            school.literacy_score
        )

        block["attendance_total"] += (
            school.attendance_rate
        )

        block["dropout_total"] += (
            school.dropout_rate
        )

    summaries = []

    for block in blocks.values():

        school_count = block["schools"]

        summaries.append(
            {
                "block": block["block"],
                "schools": school_count,
                "students": block["students"],
                "numeracy": round(
                    block["numeracy_total"]
                    / school_count,
                    1,
                ),
                "literacy": round(
                    block["literacy_total"]
                    / school_count,
                    1,
                ),
                "attendance": round(
                    block["attendance_total"]
                    / school_count,
                    1,
                ),
                "dropout": round(
                    block["dropout_total"]
                    / school_count,
                    1,
                ),
            }
        )

    summaries.sort(
        key=lambda x: x["numeracy"]
    )

    return summaries

def get_school_by_id(
    db: Session,
    school_id: str,
) -> dict | None:

    school = (
        db.query(School)
        .filter(School.school_id == school_id)
        .first()
    )

    if not school:
        return None

    return {
        "school_id": school.school_id,
        "school_name": school.school_name,
        "district": school.district,
        "block": school.block,
        "enrollment": school.enrollment,
        "teachers": school.teachers,
        "attendance_rate": school.attendance_rate,
        "infrastructure_score": school.infrastructure_score,
        "teacher_training_score": school.teacher_training_score,
        "numeracy_score": school.numeracy_score,
        "literacy_score": school.literacy_score,
        "dropout_rate": school.dropout_rate,
        "priority_score": calculate_priority_score(school),
    }


def get_block_priority_summary(
    db: Session,
) -> list[dict]:

    schools = db.query(School).all()

    blocks = {}

    for school in schools:

        if school.block not in blocks:
            blocks[school.block] = {
                "block": school.block,
                "schools": 0,
                "students": 0,
                "priority_total": 0,
            }

        block = blocks[school.block]

        block["schools"] += 1
        block["students"] += school.enrollment
        block["priority_total"] += (
            calculate_priority_score(school)
        )

    results = []

    for block in blocks.values():

        results.append(
            {
                "block": block["block"],
                "schools": block["schools"],
                "students": block["students"],
                "average_priority_score": round(
                    block["priority_total"]
                    / block["schools"],
                    2,
                ),
            }
        )

    results.sort(
        key=lambda x: x["average_priority_score"],
        reverse=True,
    )

    return results