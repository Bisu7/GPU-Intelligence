from fastapi import APIRouter, Depends
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.services.scheduler_service import scheduler_service
from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()

class RecommendRequest(BaseModel):
    min_vram_mb: Optional[float] = 0

@router.post("/recommend")
async def recommend_gpu(
    request: RecommendRequest,
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Recommend the best GPU for a new job."""
    return await scheduler_service.recommend_best_gpu(min_vram_mb=request.min_vram_mb)
