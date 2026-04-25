from typing import List, Dict
from sqlmodel import Session, select
from app.api.deps import engine
from app.models.gpu import GPUNode
from app.models.metric import GPUMetric

class OptimizerService:
    async def get_optimization_recommendations(self) -> List[Dict]:
        """
        Analyze current fleet state and suggest improvements.
        """
        recommendations = []
        
        with Session(engine) as session:
            nodes = session.exec(select(GPUNode)).all()
            
            for node in nodes:
                metric = session.exec(
                    select(GPUMetric)
                    .where(GPUMetric.node_id == node.id)
                    .order_by(GPUMetric.timestamp.desc())
                ).first()
                
                if not metric:
                    continue
                
                # Rule 1: Low Load -> Low Power Mode
                if metric.utilization < 10 and metric.power_draw > 50:
                    recommendations.append({
                        "gpu_id": node.id,
                        "gpu_name": node.name,
                        "type": "POWER_SAVING",
                        "severity": "low",
                        "message": f"{node.name} is idle ({metric.utilization}%). Recommend switching to Low Power Mode to save energy.",
                        "action": "Enable Persistence Mode & Cap Power"
                    })
                
                # Rule 2: High Load / Overload
                if metric.utilization > 90:
                    recommendations.append({
                        "gpu_id": node.id,
                        "gpu_name": node.name,
                        "type": "REBALANCE",
                        "severity": "high",
                        "message": f"{node.name} is overloaded ({metric.utilization}%). Shift workload to a cooler node.",
                        "action": "Migrate Container / Job"
                    })
                
                # Rule 3: High Temp
                if metric.temp > 80:
                    recommendations.append({
                        "gpu_id": node.id,
                        "gpu_name": node.name,
                        "type": "THERMAL",
                        "severity": "critical",
                        "message": f"{node.name} is overheating ({metric.temp}°C). Throttle clock speeds immediately.",
                        "action": "Decrease Clock Limit"
                    })

        # General Fleet Insights
        if not recommendations:
            recommendations.append({
                "type": "INFO",
                "severity": "low",
                "message": "Fleet is operating within optimal parameters.",
                "action": "None"
            })
            
        return recommendations

optimizer_service = OptimizerService()
