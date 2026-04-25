from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.services.optimizer_service import optimizer_service
from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/recommendations")
async def get_optimization_recommendations(
    current_user: User = Depends(get_current_active_user)
) -> List[Dict[str, Any]]:
    """Get actionable optimization recommendations."""
    return await optimizer_service.get_optimization_recommendations()
