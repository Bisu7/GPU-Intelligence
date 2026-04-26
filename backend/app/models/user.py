from enum import Enum
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    INFRA_MANAGER = "infra_manager"
    TEAM_LEAD = "team_lead"
    DATA_SCIENTIST = "data_scientist"
    VIEWER = "viewer"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    role: UserRole = Field(default=UserRole.DATA_SCIENTIST)
    is_active: bool = Field(default=True)
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime
