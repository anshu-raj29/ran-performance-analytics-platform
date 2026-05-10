import asyncio

from app.db.mongo import connect_to_mongo, close_mongo_connection, get_database
from app.services.simulator import TOWERS, generate_historical_series, threshold_alerts
from app.ml.anomaly_detector import detect_anomalies


async def main() -> None:
    await connect_to_mongo()
    db = get_database()
    if db is None:
        raise RuntimeError("MongoDB is not connected. Check MONGODB_URI in backend/.env.")

    records = generate_historical_series(minutes=180)
    alerts = threshold_alerts(records)
    anomalies = detect_anomalies(records)

    await db.towers.delete_many({})
    await db.kpi_history.delete_many({})
    await db.alerts.delete_many({})
    await db.anomalies.delete_many({})

    await db.towers.insert_many([tower.model_dump() for tower in TOWERS])
    await db.kpi_history.insert_many([record.model_dump() for record in records])
    if alerts:
        await db.alerts.insert_many([alert.model_dump() for alert in alerts])
    if anomalies:
        await db.anomalies.insert_many([anomaly.model_dump() for anomaly in anomalies])

    print(f"Seeded {len(TOWERS)} towers, {len(records)} KPI records, {len(alerts)} alerts, {len(anomalies)} anomalies.")
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())
