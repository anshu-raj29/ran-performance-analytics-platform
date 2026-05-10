from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.services.simulator import generate_live_snapshot, threshold_alerts


router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
async def get_alerts(_: dict = Depends(get_current_user)) -> dict:
    records = generate_live_snapshot()
    alerts = threshold_alerts(records)
    return {"items": [alert.model_dump() for alert in alerts]}
