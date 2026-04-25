from typing import List, Dict, Optional
from sqlmodel import Session, select
from app.api.deps import engine
from app.models.gpu import GPUNode
from app.models.metric import GPUMetric
from datetime import datetime, timedelta

class SchedulerService:
    async def recommend_best_gpu(self, min_vram_mb: float = 0) -> Dict:
        """
        Recommend the best GPU based on:
        - Lowest Load
        - Coolest Temperature
        - Enough VRAM
        - Power Efficiency (lowest current power draw)
        """
        with Session(engine) as session:
            # Get latest metrics for all GPUs
            # In a real app, you'd use a cache or a more efficient query
            nodes = session.exec(select(GPUNode)).all()
            recommendations = []
            
            for node in nodes:
                # Fetch latest metric for this node
                metric = session.exec(
                    select(GPUMetric)
                    .where(GPUMetric.node_id == node.id)
                    .order_by(GPUMetric.timestamp.desc())
                ).first()
                
                if not metric:
                    continue
                    
                # Check VRAM constraint
                free_vram = metric.memory_total - metric.memory_used
                if free_vram < min_vram_mb:
                    continue
                
                # Scoring logic (Lower is better)
                # Load (0-100) + Temp (0-100) + Power (normalized)
                score = (metric.utilization * 0.4) + (metric.temp * 0.3) + (metric.power_draw * 0.3)
                
                recommendations.append({
                    "gpu_id": node.id,
                    "gpu_name": node.name,
                    "score": score,
                    "metrics": {
                        "utilization": metric.utilization,
                        "temp": metric.temp,
                        "free_vram": free_vram,
                        "power_draw": metric.power_draw
                    }
                })
            
            if not recommendations:
                return {"status": "error", "message": "No suitable GPUs found"}
                
            # Sort by score ascending
            recommendations.sort(key=lambda x: x["score"])
            best = recommendations[0]
            
            return {
                "status": "success",
                "recommended_gpu": best["gpu_name"],
                "gpu_id": best["gpu_id"],
                "reason": f"Best balance of load ({best['metrics']['utilization']}%) and temperature ({best['metrics']['temp']}°C)",
                "all_options": recommendations
            }

scheduler_service = SchedulerService()
