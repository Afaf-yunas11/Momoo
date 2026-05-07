from datetime import date
from typing import Any

from pydantic import BaseModel, Field


class AgentMeta(BaseModel):
    agent_name: str
    model: str
    used_rules: list[str] = Field(default_factory=list)


class FeedAgentRequest(BaseModel):
    animal_id: str
    tag_number: str | None = None
    breed: str | None = None
    status: str | None = None
    weight_kg: float | None = None
    milk_yield_litres: float | None = None
    current_feed_type: str | None = None
    current_feed_qty_kg: float | None = None
    temperature_c: float | None = None
    humidity_pct: float | None = None
    notes: str | None = None


class FeedAgentResponse(BaseModel):
    animal_id: str
    recommended_qty_kg: float
    rationale: str
    adjustments: list[str] = Field(default_factory=list)
    alerts: list[str] = Field(default_factory=list)
    meta: AgentMeta


class HealthAgentRequest(BaseModel):
    animal_id: str
    tag_number: str | None = None
    scc: int | None = None
    bacterial_load: int | None = None
    temperature_c: float | None = None
    symptoms: list[str] = Field(default_factory=list)
    recent_milk_yield_litres: list[float] = Field(default_factory=list)
    notes: str | None = None


class HealthAgentResponse(BaseModel):
    animal_id: str
    risk_score: int = Field(ge=0, le=100)
    severity: str
    suspected_issues: list[str] = Field(default_factory=list)
    recommended_actions: list[str] = Field(default_factory=list)
    rationale: str
    meta: AgentMeta


class ReproductionAgentRequest(BaseModel):
    animal_id: str
    tag_number: str | None = None
    last_calving_date: date | None = None
    last_breeding_date: date | None = None
    pregnancy_confirmed: bool = False
    confirmation_date: date | None = None
    body_condition_score: float | None = None
    notes: str | None = None


class ReproductionAgentResponse(BaseModel):
    animal_id: str
    breeding_window: str
    expected_calving_date: date | None = None
    risk_flags: list[str] = Field(default_factory=list)
    recommended_actions: list[str] = Field(default_factory=list)
    rationale: str
    meta: AgentMeta


class ProfitAgentRequest(BaseModel):
    animal_id: str
    tag_number: str | None = None
    monthly_revenue_pkr: float | None = None
    monthly_feed_cost_pkr: float | None = None
    monthly_vet_cost_pkr: float | None = None
    monthly_other_cost_pkr: float | None = None
    milk_yield_litres: float | None = None
    status: str | None = None
    notes: str | None = None


class ProfitAgentResponse(BaseModel):
    animal_id: str
    recommendation: str
    profitability_score: int = Field(ge=0, le=100)
    estimated_margin_pkr: float
    reasoning: str
    suggested_actions: list[str] = Field(default_factory=list)
    meta: AgentMeta


class AgentTraceResponse(BaseModel):
    message: str
    details: dict[str, Any] = Field(default_factory=dict)
