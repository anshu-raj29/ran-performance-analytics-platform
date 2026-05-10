from datetime import datetime, timedelta, timezone
import math
import random
from uuid import uuid4

import numpy as np

from app.models.schemas import Alert, KpiRecord, Tower


TOWERS: list[Tower] = [
    Tower(id="CELL-101", name="Metro Core Alpha", region="Mumbai Central", latitude=19.076, longitude=72.8777, bands=["n78", "n258"], cells=9),
    Tower(id="CELL-102", name="Edge Cluster Orion", region="Navi Mumbai", latitude=19.033, longitude=73.0297, bands=["n78", "B3"], cells=6),
    Tower(id="CELL-103", name="Transport Hub Vega", region="Pune East", latitude=18.5204, longitude=73.8567, bands=["n78", "B40"], cells=8),
    Tower(id="CELL-104", name="Enterprise Zone Nova", region="Bengaluru North", latitude=13.0827, longitude=77.5877, bands=["n78", "n28"], cells=7),
    Tower(id="CELL-105", name="Campus Sector Lyra", region="Chennai OMR", latitude=12.9165, longitude=80.2337, bands=["n78", "B1"], cells=5),
    Tower(id="CELL-106", name="Airport Grid Atlas", region="Delhi NCR", latitude=28.5562, longitude=77.1, bands=["n78", "n258"], cells=10),
    Tower(id="CELL-107", name="Harbor Macro Pulse", region="Kolkata Port", latitude=22.5726, longitude=88.3639, bands=["n78", "B8"], cells=6),
    Tower(id="CELL-108", name="Industrial Ring Zenith", region="Hyderabad West", latitude=17.385, longitude=78.4867, bands=["n78", "B41"], cells=8),
]


def _wave(seed: int, spread: float = 1.0) -> float:
    now = datetime.now(timezone.utc)
    minute = now.minute + now.second / 60
    return math.sin((minute + seed) / 6) * spread


def generate_kpi_for_tower(tower: Tower) -> KpiRecord:
    seed = int(tower.id.split("-")[1])
    degradation = 0.0

    if tower.id in {"CELL-102", "CELL-107"} and datetime.now().minute % 5 in {1, 2}:
        degradation = random.uniform(0.35, 0.65)
    elif random.random() < 0.08:
        degradation = random.uniform(0.2, 0.45)

    rsrp = np.random.normal(-86 - degradation * 18 + _wave(seed, 2.2), 3.2)
    rsrq = np.random.normal(-9.5 - degradation * 6 + _wave(seed, 0.7), 1.4)
    sinr = np.random.normal(19 - degradation * 22 + _wave(seed, 2.0), 2.8)
    throughput = max(12, np.random.normal(485 - degradation * 340 + _wave(seed, 25), 45))
    latency = max(8, np.random.normal(24 + degradation * 85 - _wave(seed, 4), 7))
    packet_loss = max(0, np.random.normal(0.35 + degradation * 5.4, 0.35))
    prb = min(99, max(18, np.random.normal(56 + degradation * 34 + _wave(seed, 5), 7)))
    handover = min(99.9, max(72, np.random.normal(97.4 - degradation * 17, 1.9)))

    health = calculate_health_score(
        rsrp=rsrp,
        rsrq=rsrq,
        sinr=sinr,
        throughput_mbps=throughput,
        latency_ms=latency,
        packet_loss_pct=packet_loss,
        prb_utilization_pct=prb,
        handover_success_rate_pct=handover,
    )
    status = "DOWN" if health < 38 else "CRITICAL" if health < 58 else "WARNING" if health < 76 else "UP"

    return KpiRecord(
        tower_id=tower.id,
        timestamp=datetime.now(timezone.utc),
        rsrp=round(float(rsrp), 2),
        rsrq=round(float(rsrq), 2),
        sinr=round(float(sinr), 2),
        throughput_mbps=round(float(throughput), 2),
        latency_ms=round(float(latency), 2),
        packet_loss_pct=round(float(packet_loss), 2),
        prb_utilization_pct=round(float(prb), 2),
        handover_success_rate_pct=round(float(handover), 2),
        status=status,
        health_score=round(float(health), 2),
    )


def calculate_health_score(**kpis: float) -> float:
    score = 100.0
    score -= max(0, (-95 - kpis["rsrp"]) * 1.1)
    score -= max(0, (-12 - kpis["rsrq"]) * 1.8)
    score -= max(0, (12 - kpis["sinr"]) * 2.4)
    score -= max(0, (40 - kpis["throughput_mbps"]) * 0.3)
    score -= max(0, (kpis["latency_ms"] - 45) * 0.5)
    score -= max(0, (kpis["packet_loss_pct"] - 1.0) * 6.0)
    score -= max(0, (kpis["prb_utilization_pct"] - 82) * 0.7)
    score -= max(0, (95 - kpis["handover_success_rate_pct"]) * 2.0)
    return max(0, min(100, score))


def generate_live_snapshot() -> list[KpiRecord]:
    return [generate_kpi_for_tower(tower) for tower in TOWERS]


def generate_historical_series(minutes: int = 60) -> list[KpiRecord]:
    records: list[KpiRecord] = []
    current_time = datetime.now(timezone.utc)
    for offset in range(minutes, 0, -3):
        for tower in TOWERS:
            record = generate_kpi_for_tower(tower)
            record.timestamp = current_time - timedelta(minutes=offset)
            records.append(record)
    return records


def threshold_alerts(records: list[KpiRecord]) -> list[Alert]:
    alerts: list[Alert] = []
    for record in records:
        checks = [
            (record.sinr < 8, "critical", "Severe SINR degradation", "experiencing severe SINR degradation", ["RF interference", "beam misalignment"]),
            (record.latency_ms > 65, "high", "Latency threshold exceeded", "latency threshold exceeded on transport path", ["backhaul congestion", "edge routing delay"]),
            (record.packet_loss_pct > 2.5, "high", "Packet loss spike detected", "packet loss spike detected on user plane", ["packet drops", "congestion"]),
            (record.handover_success_rate_pct < 92, "medium", "Potential handover instability", "showing potential handover instability", ["neighbor list drift", "mobility parameter tuning"]),
            (record.prb_utilization_pct > 88, "medium", "PRB saturation risk", "approaching PRB saturation during busy-hour load", ["capacity pressure", "traffic surge"]),
        ]
        for is_breach, severity, title, message, tags in checks:
            if is_breach:
                alerts.append(
                    Alert(
                        id=str(uuid4()),
                        tower_id=record.tower_id,
                        severity=severity,
                        title=title,
                        message=f"Tower {record.tower_id} {message}.",
                        root_cause_tags=tags,
                        timestamp=record.timestamp,
                    )
                )
    return alerts
