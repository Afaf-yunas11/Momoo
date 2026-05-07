from langchain_openrouter import ChatOpenRouter

from app.config import settings
from app.exceptions import MissingModelConfigurationError


def get_llm() -> ChatOpenRouter:
    api_key = settings.openrouter_api_key
    if not api_key:
        raise MissingModelConfigurationError(
            "OpenRouter API key is not configured. Set OPENROUTER_API_KEY."
        )

    return ChatOpenRouter(
        model=settings.openrouter_model,
        api_key=api_key,
        temperature=0.2,
    )