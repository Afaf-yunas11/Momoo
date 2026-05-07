from app.agents.base import BaseDecisionAgent
from app.tools import cost_margin


class ProfitRecommendationAgent(BaseDecisionAgent):
    agent_name = "profit-agent"
    system_prompt = (
        "You are a dairy profitability agent. "
        "Assess keep or sell style recommendations from simple financial inputs and production context. "
        "Return business-friendly JSON only."
    )

    def build_context(self, payload: dict) -> tuple[dict, list[str]]:
        margin = cost_margin(
            payload.get("monthly_revenue_pkr"),
            payload.get("monthly_feed_cost_pkr"),
            payload.get("monthly_vet_cost_pkr"),
            payload.get("monthly_other_cost_pkr"),
        )
        baseline_score = 50
        if margin > 0:
            baseline_score += 20
        if (payload.get("milk_yield_litres") or 0) > 18:
            baseline_score += 15
        if payload.get("status", "").lower() == "sick":
            baseline_score -= 20

        return {
            "estimated_margin_pkr": margin,
            "rule_based_profitability_score": max(0, min(100, baseline_score)),
        }, ["margin_rule", "yield_profit_rule", "status_penalty_rule"]

    def output_example(self, payload: dict) -> dict:
        return {
            "animal_id": payload.get("animal_id"),
            "recommendation": "KEEP",
            "profitability_score": 72,
            "estimated_margin_pkr": 12000.0,
            "reasoning": "Brief reason.",
            "suggested_actions": ["Monitor feed efficiency weekly"],
        }
