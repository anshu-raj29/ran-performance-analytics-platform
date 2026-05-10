from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.services.simulator import TOWERS, generate_historical_series, generate_live_snapshot


router = APIRouter(prefix="/tower", tags=["tower"])


@router.get("/{tower_id}")
async def get_tower(tower_id: str, _: dict = Depends(get_current_user)) -> dict:
    tower = next((item for item in TOWERS if item.id == tower_id), None)
    if not tower:
        raise HTTPException(status_code=404, detail="Tower not found")

    current = next(record for record in generate_live_snapshot() if record.tower_id == tower_id)
    history = [record for record in generate_historical_series(minutes=48) if record.tower_id == tower_id]
    return {
        "tower": tower.model_dump(),
        "current": current.model_dump(),
        "history": [record.model_dump() for record in history],
    }


@router.get("")
async def list_towers(_: dict = Depends(get_current_user)) -> dict:
    return {"items": [tower.model_dump() for tower in TOWERS]}
