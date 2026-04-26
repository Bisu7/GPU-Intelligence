from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class GPUNodeBase(SQLModel):
    name: str = Field(index=True)
    hostname: str
    ip_address: str
    status: str = Field(default="online")  # online, offline, maintenance
    cluster_id: Optional[int] = Field(default=None, foreign_key="cluster.id")
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    location: Optional[str] = None
    project: Optional[str] = None
    tags: Optional[str] = None  # Comma-separated tags

class GPUNode(GPUNodeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    metrics: List["GPUMetric"] = Relationship(back_populates="node")
    cluster: Optional["Cluster"] = Relationship(back_populates="gpus")
    team: Optional["Team"] = Relationship(back_populates="gpus")

class GPUNodeCreate(GPUNodeBase):
    pass

class GPUNodeRead(GPUNodeBase):
    id: int
