import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
from app.api.api import api_router
from app.api.endpoints import websockets
from app.models import User, GPUNode, GPUMetric, Alert
from app.core.config import settings
from app.api.deps import engine
from app.services.metrics_worker import metrics_broadcast_worker

import bcrypt
# Monkeypatch bcrypt for passlib compatibility
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type("About", (object,), {"__version__": bcrypt.__version__})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    # Seed default node
    with Session(engine) as session:
        from app.models.gpu import GPUNode
        from sqlmodel import select
        existing_node = session.exec(select(GPUNode)).first()
        if not existing_node:
            default_node = GPUNode(
                id=1,
                name="Primary Cluster Node",
                hostname="node-01",
                ip_address="127.0.0.1",
                status="online"
            )
            session.add(default_node)
            session.commit()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()
    # Start the background metrics worker
    asyncio.create_task(metrics_broadcast_worker())

app.include_router(api_router, prefix="/api/v1")
app.include_router(websockets.router, tags=["websockets"])

@app.get("/")
def root():
    return {"message": "GPU Intelligence API is running"}
