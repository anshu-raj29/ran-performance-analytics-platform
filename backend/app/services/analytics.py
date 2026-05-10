from statistics import mean

from app.models.schemas import DashboardSummary, KpiRecord


def dashboard_summary(records: list[KpiRecord], critical_alerts: int) -> DashboardSummary:
    total = len(records)
    active = len([record for record in records if record.status in {"UP", "WARNING"}])
    down = len([record for record in records if record.status == "DOWN"])
    average_health = mean([record.health_score for record in records]) if records else 0
    sla = len([record for record in records if record.latency_ms < 50 and record.packet_loss_pct < 1.5]) / total * 100 if total else 0

    return DashboardSummary(
        total_towers=total,
        active_towers=active,
        down_towers=down,
        critical_alerts=critical_alerts,
        network_health_score=round(average_health, 2),
        sla_compliance=round(sla, 2),
    )


def regional_health(records: list[KpiRecord]) -> list[dict]:
    return [
        {
            "tower_id": record.tower_id,
            "health_score": record.health_score,
            "status": record.status,
            "latency_ms": record.latency_ms,
            "throughput_mbps": record.throughput_mbps,
        }
        for record in records
    ]
