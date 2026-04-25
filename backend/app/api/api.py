from fastapi import APIRouter
from app.api.endpoints import auth, metrics, alerts, predictions, scheduler, optimizer

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(predictions.router, prefix="/prediction", tags=["prediction"])
api_router.include_router(scheduler.router, prefix="/scheduler", tags=["scheduler"])
api_router.include_router(optimizer.router, prefix="/optimizer", tags=["optimizer"])
