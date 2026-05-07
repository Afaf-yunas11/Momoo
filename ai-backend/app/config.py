from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False, extra="ignore")

    ai_service_name: str = "moomoo-ai-backend"
    ai_debug: bool = False

    # OpenRouter
    openrouter_api_key: str = "your_openrouter_api_key_here"
    openrouter_model: str = "nvidia/nemotron-3-super-120b-a12b:free"

    # Optional attribution (recommended by OpenRouter)
    openrouter_app_name: str = Field(
        default="moomoo-ai-backend",
        alias="OPENROUTER_APP_NAME",
    )
    openrouter_app_url: str | None = Field(
        default=None,
        alias="OPENROUTER_APP_URL",
    )

    # ---- temporary compatibility shim ----
    @property
    def effective_api_key(self) -> str | None:
        return self.openrouter_api_key

    @property
    def gemini_model(self) -> str:
        return self.openrouter_model
    # --------------------------------------


settings = Settings()