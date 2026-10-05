from fastapi import APIRouter

from app.models.schemas import SourceRecord
from app.services.retrieval import get_source_catalog

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("", response_model=list[SourceRecord])
def list_sources() -> list[SourceRecord]:
    return get_source_catalog()
