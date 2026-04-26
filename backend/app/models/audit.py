from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class AuditLogBase(SQLModel):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(AuditLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AuditLogRead(AuditLogBase):
    id: int
    user_email: Optional[str] = None
