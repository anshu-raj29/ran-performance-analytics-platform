from datetime import datetime
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    display_name: str


class Tower(BaseModel):
    id: str
    name: str
    region: str
    vendor: str = "Multi-vendor RAN"
    latitude: float
    longitude: float
    bands: list[str]
    cells: int
    status: str = "UP"


class KpiRecord(BaseModel):
    tower_id: str
    timestamp: datetime
    rsrp: float = Field(description="Reference Signal Received Power in dBm")
    rsrq: float = Field(description="Reference Signal Received Quality in dB")
    sinr: float = Field(description="Signal-to-Interference-plus-Noise Ratio in dB")
    throughput_mbps: float
    latency_ms: float
    packet_loss_pct: float
    prb_utilization_pct: float
    handover_success_rate_pct: float
    status: str
    health_score: float


class Alert(BaseModel):
    id: str
    tower_id: str
    severity: str
    title: str
    message: str
    root_cause_tags: list[str]
    timestamp: datetime
    acknowledged: bool = False


class Anomaly(BaseModel):
    id: str
    tower_id: str
    severity: str
    anomaly_score: float
    model: str = "IsolationForest"
    indicators: list[str]
    root_cause_hypothesis: list[str]
    timestamp: datetime


class DashboardSummary(BaseModel):
    total_towers: int
    active_towers: int
    down_towers: int
    critical_alerts: int
    network_health_score: float
    sla_compliance: float
