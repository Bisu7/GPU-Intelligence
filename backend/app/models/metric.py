from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class GPUMetricBase(SQLModel):
    gpu_index: int
    name: str
    utilization: float
    memory_used: float
    memory_total: float
    temp: float
    power_draw: float
    fan_speed: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class GPUMetric(GPUMetricBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    node_id: int = Field(foreign_key="gpunode.id")
    node: "GPUNode" = Relationship(back_populates="metrics")

class GPUMetricCreate(GPUMetricBase):
    node_id: int

class GPUMetricRead(GPUMetricBase):
    id: int
    node_id: int
