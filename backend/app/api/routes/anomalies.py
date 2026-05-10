from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.ml.anomaly_detector import detect_anomalies
from app.services.simulator import generate_historical_series


router = APIRouter(prefix="/anomalies", tags=["anomalies"])


@router.get("")
async def get_anomalies(_: dict = Depends(get_current_user)) -> dict:
    records = generate_historical_series(minutes=36)
    anomalies = detect_anomalies(records)
    return {"items": [anomaly.model_dump() for anomaly in anomalies]}
