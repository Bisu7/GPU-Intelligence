from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Alert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gpu_id: int
    type: str  # temperature, memory, power, offline
    severity: str  # critical, warning, info
    message: str
    is_resolved: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
