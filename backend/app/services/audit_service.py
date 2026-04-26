from typing import Optional
from sqlmodel import Session
from app.models.audit import AuditLog
from fastapi import Request

class AuditService:
    @staticmethod
    def log(
        db: Session,
        user_id: Optional[int],
        action: str,
        details: Optional[str] = None,
        request: Optional[Request] = None
    ):
        ip_address = None
        if request:
            ip_address = request.client.host
        
        db_log = AuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address
        )
        db.add(db_log)
        db.commit()

audit_service = AuditService()
