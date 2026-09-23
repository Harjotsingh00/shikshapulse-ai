from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.ai import router as ai_router
from .routes.dashboard import router as dashboard_router
from .routes.insights import router as insights_router
from .routes.actions import router as actions_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ShikshaPulse AI",
    description=("AI-powered education data and action intelligence platform"),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(dashboard_router)

app.include_router(ai_router)

app.include_router(insights_router)

app.include_router(actions_router)


@app.get("/")
def root():
    return {
        "name": "ShikshaPulse AI",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "shikshapulse-backend",
    }
