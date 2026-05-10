from datetime import datetime, timezone
from uuid import uuid4

import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from app.models.schemas import Anomaly, KpiRecord


FEATURES = [
    "rsrp",
    "rsrq",
    "sinr",
    "throughput_mbps",
    "latency_ms",
    "packet_loss_pct",
    "prb_utilization_pct",
    "handover_success_rate_pct",
]


def _records_to_frame(records: list[KpiRecord]) -> pd.DataFrame:
    return pd.DataFrame([record.model_dump() for record in records])


def detect_anomalies(records: list[KpiRecord]) -> list[Anomaly]:
    if len(records) < 8:
        return []

    frame = _records_to_frame(records)
    scaler = StandardScaler()
    features = scaler.fit_transform(frame[FEATURES])

    model = IsolationForest(
        n_estimators=120,
        contamination=0.16,
        random_state=42,
    )
    predictions = model.fit_predict(features)
    scores = model.decision_function(features)

    anomalies: list[Anomaly] = []
    for index, prediction in enumerate(predictions):
        if prediction != -1:
            continue
        row = frame.iloc[index]
        indicators = _indicators(row)
        severity = _severity(row, scores[index])
        anomalies.append(
            Anomaly(
                id=str(uuid4()),
                tower_id=str(row["tower_id"]),
                severity=severity,
                anomaly_score=round(float(abs(scores[index]) * 100), 2),
                indicators=indicators,
                root_cause_hypothesis=_root_causes(indicators),
                timestamp=row.get("timestamp", datetime.now(timezone.utc)),
            )
        )
    return anomalies


def _indicators(row) -> list[str]:
    indicators: list[str] = []
    if row["sinr"] < 10:
        indicators.append("SINR degradation")
    if row["rsrp"] < -100:
        indicators.append("weak RSRP coverage")
    if row["latency_ms"] > 55:
        indicators.append("latency outlier")
    if row["packet_loss_pct"] > 1.8:
        indicators.append("packet loss burst")
    if row["prb_utilization_pct"] > 84:
        indicators.append("PRB congestion")
    if row["handover_success_rate_pct"] < 94:
        indicators.append("handover instability")
    return indicators or ["multi-KPI distribution shift"]


def _severity(row, score: float) -> str:
    if row["health_score"] < 50 or score < -0.08:
        return "critical"
    if row["health_score"] < 70 or score < -0.03:
        return "high"
    return "medium"


def _root_causes(indicators: list[str]) -> list[str]:
    causes = set()
    for indicator in indicators:
        if "SINR" in indicator:
            causes.update(["RF interference", "overshooting neighbor cell"])
        if "RSRP" in indicator:
            causes.update(["coverage hole", "antenna tilt drift"])
        if "latency" in indicator or "packet" in indicator:
            causes.update(["transport congestion", "UPF path instability"])
        if "PRB" in indicator:
            causes.update(["busy-hour capacity pressure", "scheduler saturation"])
        if "handover" in indicator:
            causes.update(["mobility parameter mismatch", "neighbor relation issue"])
    return sorted(causes) or ["correlated RAN performance drift"]
