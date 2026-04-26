from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class APIKeyBase(SQLModel):
    name: str
    prefix: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used_at: Optional[datetime] = None
    is_active: bool = Field(default=True)
    user_id: int = Field(foreign_key="user.id")

class APIKey(APIKeyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key_hash: str

class APIKeyCreate(SQLModel):
    name: str

class APIKeyRead(APIKeyBase):
    id: int
