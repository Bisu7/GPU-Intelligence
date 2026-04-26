from fastapi import APIRouter, Depends, Request
from sqlmodel import Session
from app.api import deps
from app.models.user import User, UserRole
from app.services.audit_service import audit_service

router = APIRouter()

@router.get("/")
def get_settings(
    current_user: User = Depends(deps.get_current_active_user),
):
    return {
        "site_name": "GPU Intelligence",
        "maintenance_mode": False,
        "slack_notifications": True,
        "email_notifications": True,
        "rate_limiting_enabled": True,
        "max_keys_per_user": 5
    }

@router.post("/")
def update_settings(
    settings_in: dict,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.check_role([UserRole.SUPER_ADMIN])),
    request: Request = None
):
    # In a real app, this would update a 'Settings' table in DB
    audit_service.log(
        db,
        user_id=current_user.id,
        action="settings_update",
        details=f"Updated system settings: {settings_in}",
        request=request
    )
    return {"message": "Settings updated", "settings": settings_in}
