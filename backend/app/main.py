from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import alerts, anomalies, auth, dashboard, health, kpis, towers
from app.core.config import get_settings
from app.db.mongo import close_mongo_connection, connect_to_mongo


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="5G RAN KPI analytics, anomaly detection, and network health APIs.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(kpis.router)
app.include_router(alerts.router)
app.include_router(anomalies.router)
app.include_router(health.router)
app.include_router(towers.router)


@app.get("/")
async def root() -> dict:
    return {
        "service": settings.app_name,
        "status": "operational",
        "docs": "/docs",
    }
