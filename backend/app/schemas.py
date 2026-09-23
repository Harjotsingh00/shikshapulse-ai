from pydantic import BaseModel, Field


class ActionCreate(BaseModel):

    school_id: str = Field(
        min_length=1,
        max_length=50,
    )

    identified_gap: str = Field(
        min_length=1,
        max_length=300,
    )

    recommended_action: str = Field(
        min_length=1,
    )

    owner: str = Field(
        min_length=1,
        max_length=200,
    )

    deadline: str = Field(
        min_length=1,
        max_length=50,
    )


class ActionUpdate(BaseModel):

    owner: str | None = None

    deadline: str | None = None

    status: str | None = None

    outcome: str | None = None

    recommended_action: str | None = None


class ActionResponse(BaseModel):

    id: int
    school_id: str
    identified_gap: str
    recommended_action: str
    owner: str
    deadline: str
    status: str
    outcome: str

    class Config:
        from_attributes = True