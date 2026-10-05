from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "IP-SAKTI Sahayak"
    app_env: str = "development"
    api_prefix: str = "/api"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/ip_sakti"
    allowed_origins_raw: str = Field(default="http://localhost:5173", validation_alias="ALLOWED_ORIGINS")
    min_confidence: float = 0.42
    rag_mode: str = "demo"
    bhashini_user_id: str | None = None
    bhashini_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [item.strip() for item in self.allowed_origins_raw.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
