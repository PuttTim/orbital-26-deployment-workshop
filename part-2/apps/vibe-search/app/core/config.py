from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    model_name: str = "all-MiniLM-L6-v2"
    vibe_search_api_key: str | None = None
    sentry_dsn: str | None = None
    sentry_environment: str = "production"
    sentry_debug_enabled: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
