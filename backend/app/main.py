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
from fastapi import Request, HTTPException
import time
from collections import defaultdict

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

# Rate Limiting
rate_limit_storage = defaultdict(list)
RATE_LIMIT_CALLS = 100
RATE_LIMIT_WINDOW = 60 # seconds

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()
    
    # Filter out old requests
    rate_limit_storage[client_ip] = [t for t in rate_limit_storage[client_ip] if now - t < RATE_LIMIT_WINDOW]
    
    if len(rate_limit_storage[client_ip]) >= RATE_LIMIT_CALLS:
        raise HTTPException(status_code=429, detail="Too many requests")
    
    rate_limit_storage[client_ip].append(now)
    response = await call_next(request)
    return response

# Security Headers
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

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
