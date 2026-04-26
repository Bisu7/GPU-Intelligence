from datetime import datetime
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.models.alert import Alert
from app.services.notification_service import notification_service
from app.services.audit_service import audit_service
from fastapi import Request

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
    
    notification_service.send_slack_alert(f"Alert {alert_id} resolved by {current_user.email}")
    
    return {"status": "success"}

@router.post("/test-notification")
def test_notification(
    current_user: Any = Depends(deps.get_current_active_admin),
):
    notification_service.send_slack_alert(f"Test alert from {current_user.email}")
    notification_service.send_email_alert("GPU Platform Test", "This is a test notification", current_user.email)
    return {"status": "notifications sent"}
