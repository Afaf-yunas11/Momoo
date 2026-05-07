from fastapi import FastAPI, HTTPException

from app.agents.feed import FeedRecommendationAgent
from app.agents.health import HealthRiskAgent
from app.agents.profit import ProfitRecommendationAgent
from app.agents.reproduction import ReproductionRecommendationAgent
from app.config import settings
from app.exceptions import MissingModelConfigurationError
from app.schemas import (
    AgentTraceResponse,
    FeedAgentRequest,
    FeedAgentResponse,
    HealthAgentRequest,
    HealthAgentResponse,
    ProfitAgentRequest,
    ProfitAgentResponse,
    ReproductionAgentRequest,
    ReproductionAgentResponse,
)

app = FastAPI(title="mOOMOO AI Backend", version="0.1.0")

feed_agent = FeedRecommendationAgent()
health_agent = HealthRiskAgent()
reproduction_agent = ReproductionRecommendationAgent()
profit_agent = ProfitRecommendationAgent()


@app.get("/health")
def healthcheck() -> dict:
    return {
        "service": settings.ai_service_name,
        "status": "ok",
        "model_configured": bool(settings.effective_api_key),
        "model": settings.gemini_model,
    }


@app.post("/ai/feed/recommend", response_model=FeedAgentResponse)
def recommend_feed(payload: FeedAgentRequest) -> FeedAgentResponse:
    try:
        result = feed_agent.invoke(payload.model_dump())
        return FeedAgentResponse.model_validate(result)
    except MissingModelConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/ai/health/check", response_model=HealthAgentResponse)
def check_health(payload: HealthAgentRequest) -> HealthAgentResponse:
    try:
        result = health_agent.invoke(payload.model_dump())
        return HealthAgentResponse.model_validate(result)
    except MissingModelConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/ai/reproduction/recommend", response_model=ReproductionAgentResponse)
def recommend_reproduction(payload: ReproductionAgentRequest) -> ReproductionAgentResponse:
    try:
        result = reproduction_agent.invoke(payload.model_dump(mode="python"))
        return ReproductionAgentResponse.model_validate(result)
    except MissingModelConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/ai/profit/analyze", response_model=ProfitAgentResponse)
def analyze_profit(payload: ProfitAgentRequest) -> ProfitAgentResponse:
    try:
        result = profit_agent.invoke(payload.model_dump())
        return ProfitAgentResponse.model_validate(result)
    except MissingModelConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/ai/trace", response_model=AgentTraceResponse)
def trace_info() -> AgentTraceResponse:
    return AgentTraceResponse(
        message="Agent backend is wired. Add GEMINI_API_KEY later to enable model-backed decisions.",
        details={
            "service": settings.ai_service_name,
            "model": settings.gemini_model,
            "configured": bool(settings.effective_api_key),
            "agents": [
                "feed-recommendation-agent",
                "health-risk-agent",
                "reproduction-agent",
                "profit-agent",
            ],
        },
    )
