from fastapi import APIRouter

from app.api.routes import assistant, health, sources

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(assistant.router)
api_router.include_router(sources.router)
