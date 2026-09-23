from pathlib import Path

import pandas as pd

from app.database import Base, SessionLocal, engine
from app.models import School


BASE_DIR = Path(__file__).resolve().parent.parent
CSV_PATH = BASE_DIR / "data" / "education_data.csv"


def seed_database():
    print("Creating database tables...")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_count = db.query(School).count()

        if existing_count > 0:
            print(
                f"Database already contains {existing_count} schools."
            )
            return

        print(f"Reading dataset: {CSV_PATH}")

        df = pd.read_csv(CSV_PATH)

        required_columns = [
            "school_id",
            "school_name",
            "district",
            "block",
            "enrollment",
            "teachers",
            "attendance_rate",
            "infrastructure_score",
            "teacher_training_score",
            "numeracy_score",
            "literacy_score",
            "dropout_rate",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing columns: {missing_columns}"
            )

        for _, row in df.iterrows():
            school = School(
                school_id=str(row["school_id"]),
                school_name=str(row["school_name"]),
                district=str(row["district"]),
                block=str(row["block"]),
                enrollment=int(row["enrollment"]),
                teachers=int(row["teachers"]),
                attendance_rate=float(row["attendance_rate"]),
                infrastructure_score=float(
                    row["infrastructure_score"]
                ),
                teacher_training_score=float(
                    row["teacher_training_score"]
                ),
                numeracy_score=float(row["numeracy_score"]),
                literacy_score=float(row["literacy_score"]),
                dropout_rate=float(row["dropout_rate"]),
            )

            db.add(school)

        db.commit()

        print(
            f"Successfully inserted {len(df)} schools."
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()