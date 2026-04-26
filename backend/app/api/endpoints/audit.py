from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, desc
from app.api import deps
from app.models.audit import AuditLog, AuditLogRead
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/logs", response_model=List[AuditLogRead])
def read_audit_logs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.check_role([UserRole.SUPER_ADMIN])),
):
    logs = db.exec(select(AuditLog).order_by(desc(AuditLog.timestamp)).offset(skip).limit(limit)).all()
    return logs
