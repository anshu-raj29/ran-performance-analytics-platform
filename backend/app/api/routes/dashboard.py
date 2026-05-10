from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.db.mongo import get_database
from app.ml.anomaly_detector import detect_anomalies
from app.services.analytics import dashboard_summary, regional_health
from app.services.simulator import generate_live_snapshot, threshold_alerts


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
async def get_dashboard(_: dict = Depends(get_current_user)) -> dict:
    records = generate_live_snapshot()
    alerts = threshold_alerts(records)
    anomalies = detect_anomalies(records)

    db = get_database()
    if db is not None:
        await db.kpi_history.insert_many([record.model_dump() for record in records])
        if alerts:
            await db.alerts.insert_many([alert.model_dump() for alert in alerts])
        if anomalies:
            await db.anomalies.insert_many([item.model_dump() for item in anomalies])

    critical_alerts = len([alert for alert in alerts if alert.severity in {"critical", "high"}])
    return {
        "summary": dashboard_summary(records, critical_alerts).model_dump(),
        "live_kpis": [record.model_dump() for record in records],
        "alerts": [alert.model_dump() for alert in alerts[:8]],
        "anomalies": [item.model_dump() for item in anomalies],
        "regional_health": regional_health(records),
    }
