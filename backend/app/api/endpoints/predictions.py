from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.services.ml_service import ml_service
from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/load/{gpu_id}")
async def get_load_prediction(
    gpu_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Get load prediction for a specific GPU."""
    prediction = await ml_service.predict_load(gpu_id)
    cost = await ml_service.forecast_monthly_cost(gpu_id)
    return {
        "gpu_id": gpu_id,
        "prediction": prediction,
        "monthly_cost_forecast": cost
    }

@router.get("/temp-risk/{gpu_id}")
async def get_temp_risk(
    gpu_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Get temperature risk prediction for a specific GPU."""
    risk = await ml_service.predict_temperature_risk(gpu_id)
    return risk
