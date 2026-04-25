from datetime import datetime
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.models.alert import Alert

router = APIRouter()

@router.get("/", response_model=List[Alert])
def get_alerts(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
    is_resolved: bool = False
) -> Any:
    """
    Retrieve alerts.
    """
    alerts = db.exec(select(Alert).where(Alert.is_resolved == is_resolved).order_by(Alert.timestamp.desc())).all()
    return alerts

@router.post("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark an alert as resolved.
    """
    alert = db.get(Alert, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_resolved = True
    alert.resolved_at = datetime.utcnow()
    db.add(alert)
    db.commit()
    return {"status": "success"}
