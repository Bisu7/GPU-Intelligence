from datetime import datetime
from sqlmodel import Session, select
from app.api.deps import engine
from app.models.alert import Alert

class AlertService:
    def __init__(self):
        # Thresholds
        self.TEMP_THRESHOLD = 80  # Celsius
        self.MEM_THRESHOLD = 90   # Percent
        self.POWER_THRESHOLD = 400 # Watts

    def process_metrics(self, metrics: list):
        with Session(engine) as db:
            for m in metrics:
                self._check_temp(db, m)
                self._check_memory(db, m)
                self._check_power(db, m)

    def _check_temp(self, db: Session, m: dict):
        if m["temp"] > self.TEMP_THRESHOLD:
            self._create_alert(db, m["gpu_index"], "temperature", "critical", 
                               f"High temperature detected: {m['temp']}°C")

    def _check_memory(self, db: Session, m: dict):
        usage = (m["memory_used"] / m["memory_total"]) * 100
        if usage > self.MEM_THRESHOLD:
            self._create_alert(db, m["gpu_index"], "memory", "warning", 
                               f"Memory usage critical: {usage:.1f}%")

    def _check_power(self, db: Session, m: dict):
        if m["power_draw"] > self.POWER_THRESHOLD:
            self._create_alert(db, m["gpu_index"], "power", "warning", 
                               f"Power consumption spike: {m['power_draw']}W")

    def _create_alert(self, db: Session, gpu_id: int, alert_type: str, severity: str, message: str):
        # Check if an unresolved alert of the same type already exists for this GPU
        existing = db.exec(
            select(Alert).where(
                Alert.gpu_id == gpu_id, 
                Alert.type == alert_type, 
                Alert.is_resolved == False
            )
        ).first()
        
        if not existing:
            alert = Alert(
                gpu_id=gpu_id,
                type=alert_type,
                severity=severity,
                message=message
            )
            db.add(alert)
            db.commit()

alert_service = AlertService()
