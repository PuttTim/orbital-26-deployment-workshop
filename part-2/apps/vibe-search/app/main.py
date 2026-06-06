from fastapi import FastAPI
import sentry_sdk

from app.api.routes import router
from app.core.config import get_settings

settings = get_settings()

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.sentry_environment,
        traces_sample_rate=0.1,
    )

app = FastAPI(title="Vibe Search", version="0.1.0")
app.include_router(router)
