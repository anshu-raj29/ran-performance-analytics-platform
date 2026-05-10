from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.services.analytics import regional_health
from app.services.simulator import generate_live_snapshot


router = APIRouter(prefix="/network-health", tags=["network-health"])


@router.get("")
async def get_network_health(_: dict = Depends(get_current_user)) -> dict:
    records = generate_live_snapshot()
    return {
        "average": round(sum(record.health_score for record in records) / len(records), 2),
        "regions": regional_health(records),
        "distribution": {
            "healthy": len([record for record in records if record.status == "UP"]),
            "warning": len([record for record in records if record.status == "WARNING"]),
            "critical": len([record for record in records if record.status in {"CRITICAL", "DOWN"}]),
        },
    }
