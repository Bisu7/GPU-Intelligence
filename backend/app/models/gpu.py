from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class GPUNodeBase(SQLModel):
    name: str = Field(index=True)
    hostname: str
    ip_address: str
    status: str = Field(default="online")  # online, offline, maintenance

class GPUNode(GPUNodeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    metrics: List["GPUMetric"] = Relationship(back_populates="node")

class GPUNodeCreate(GPUNodeBase):
    pass

class GPUNodeRead(GPUNodeBase):
    id: int
