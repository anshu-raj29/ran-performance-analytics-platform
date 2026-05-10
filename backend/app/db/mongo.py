from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import get_settings


settings = get_settings()
client: AsyncIOMotorClient | None = None
database = None


async def connect_to_mongo() -> None:
    global client, database
    if not settings.mongodb_uri:
        return

    client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=2500)
    database = client[settings.mongodb_database]
    try:
        await client.admin.command("ping")
        await database.kpi_history.create_index([("tower_id", 1), ("timestamp", -1)])
        await database.alerts.create_index([("timestamp", -1)])
        await database.anomalies.create_index([("timestamp", -1)])
    except Exception:
        database = None


async def close_mongo_connection() -> None:
    global client
    if client:
        client.close()
        client = None


def get_database():
    return database
