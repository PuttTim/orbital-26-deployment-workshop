from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.models import VibeSearchRequest, VibeSearchResponse
from app.services.vibe_search import search_colors

router = APIRouter(prefix="/api")


@router.get("/health")
def health() -> dict[str, bool | str]:
    return {"ok": True, "service": "vibe-search"}


@router.get("/debug-sentry")
def debug_sentry() -> None:
    if not get_settings().sentry_debug_enabled:
        raise HTTPException(status_code=404, detail="Not found")

    raise RuntimeError("Testing Sentry integration from FastAPI")


@router.post("/vibe-search")
def vibe_search(request: VibeSearchRequest) -> VibeSearchResponse:
    return search_colors(request.query)
