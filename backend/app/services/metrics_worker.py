import asyncio
import logging
from datetime import datetime
from sqlmodel import Session
from app.api.deps import engine
from app.services.gpu_monitor import gpu_monitor
from app.services.alert_service import alert_service
from app.core.websockets import manager
from app.models.metric import GPUMetric
from app.core.config import settings

logger = logging.getLogger(__name__)

async def metrics_broadcast_worker():
    """
    Background worker that collects metrics and broadcasts them via WebSockets.
    Also saves metrics to the database at a specific interval.
    """
    save_counter = 0
    save_interval = 6  # Save to DB every 6 * 5 seconds = 30 seconds
    
    while True:
        try:
            metrics = gpu_monitor.get_metrics()
            
            # Process alerts
            alert_service.process_metrics(metrics)
            
            # Broadcast to all connected clients
            await manager.broadcast({
                "type": "live_metrics",
                "data": metrics,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Periodically save to DB
            save_counter += 1
            if save_counter >= save_interval:
                save_counter = 0
                save_metrics_to_db(metrics)
                
            await asyncio.sleep(settings.MONITOR_INTERVAL)
        except Exception as e:
            logger.error(f"Error in metrics worker: {e}")
            await asyncio.sleep(5)

def save_metrics_to_db(metrics_list: list):
    with Session(engine) as db:
        for m in metrics_list:
            # For simplicity, we assume node_id 1 exists for now
            # In a real app, we'd look up the node_id by hostname
            metric_db = GPUMetric(
                node_id=1,
                gpu_index=m["gpu_index"],
                name=m["name"],
                utilization=m["utilization"],
                memory_used=m["memory_used"],
                memory_total=m["memory_total"],
                temp=m["temp"],
                power_draw=m["power_draw"],
                fan_speed=m["fan_speed"]
            )
            db.add(metric_db)
        db.commit()
