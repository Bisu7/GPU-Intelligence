from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class TeamBase(SQLModel):
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Team(TeamBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    users: List["User"] = Relationship(back_populates="team")
    gpus: List["GPUNode"] = Relationship(back_populates="team")

class TeamCreate(TeamBase):
    pass

class TeamRead(TeamBase):
    id: int
