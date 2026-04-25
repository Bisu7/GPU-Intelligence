from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.services.gpu_monitor import gpu_monitor

router = APIRouter()

@router.get("/live")
def get_live_metrics(
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get live GPU metrics from the current node.
    """
    return gpu_monitor.get_metrics()

@router.get("/summary")
def get_metrics_summary(
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a summary of GPU metrics for the dashboard cards.
    """
    metrics = gpu_monitor.get_metrics()
    if not metrics:
        return {
            "total_gpus": 0,
            "active_gpus": 0,
            "avg_temp": 0,
            "avg_utilization": 0
        }
    
    total_gpus = len(metrics)
    active_gpus = len([m for m in metrics if m["utilization"] > 5])
    avg_temp = sum([m["temp"] for m in metrics]) / total_gpus
    avg_utilization = sum([m["utilization"] for m in metrics]) / total_gpus
    
    return {
        "total_gpus": total_gpus,
        "active_gpus": active_gpus,
        "avg_temp": round(avg_temp, 1),
        "avg_utilization": round(avg_utilization, 1)
    }

@router.get("/history/{gpu_index}")
def get_gpu_history(
    gpu_index: int,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
    limit: int = 100
) -> Any:
    """
    Get historical metrics for a specific GPU.
    """
    from app.models.metric import GPUMetric
    metrics = db.exec(
        select(GPUMetric)
        .where(GPUMetric.gpu_index == gpu_index)
        .order_by(GPUMetric.timestamp.desc())
        .limit(limit)
    ).all()
    # Reverse to show chronological order in charts
    return metrics[::-1]

@router.get("/{gpu_index}")
def get_gpu_details(
    gpu_index: int,
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current details for a specific GPU.
    """
    metrics = gpu_monitor.get_metrics()
    for m in metrics:
        if m["gpu_index"] == gpu_index:
            return m
    raise HTTPException(status_code=404, detail="GPU not found")
