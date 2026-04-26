from typing import List
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.get("/usage")
def read_billing_usage(
    current_user: User = Depends(deps.get_current_active_user),
):
    # Mock data for phase 4
    return {
        "current_period": "2026-04",
        "total_compute_hours": 1240.5,
        "active_gpus": 12,
        "estimated_cost": 450.25,
        "currency": "USD",
        "usage_by_project": [
            {"project": "LLM Training", "hours": 850.5, "cost": 310.20},
            {"project": "Stable Diffusion", "hours": 300.0, "cost": 120.05},
            {"project": "Inference API", "hours": 90.0, "cost": 20.00}
        ]
    }
