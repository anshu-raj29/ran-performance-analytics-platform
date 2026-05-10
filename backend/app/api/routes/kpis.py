from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_current_user
from app.services.simulator import generate_historical_series, generate_live_snapshot


router = APIRouter(prefix="/kpis", tags=["kpis"])


@router.get("")
async def get_kpis(
    tower_id: str | None = Query(default=None),
    mode: str = Query(default="live", pattern="^(live|history)$"),
    _: dict = Depends(get_current_user),
) -> dict:
    records = generate_live_snapshot() if mode == "live" else generate_historical_series()
    if tower_id:
        records = [record for record in records if record.tower_id == tower_id]
    return {"items": [record.model_dump() for record in records]}
