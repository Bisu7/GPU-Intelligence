from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class ClusterBase(SQLModel):
    name: str = Field(index=True, unique=True)
    location: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Cluster(ClusterBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gpus: List["GPUNode"] = Relationship(back_populates="cluster")

class ClusterCreate(ClusterBase):
    pass

class ClusterRead(ClusterBase):
    id: int
