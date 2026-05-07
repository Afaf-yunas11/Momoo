from app.agents.base import BaseDecisionAgent
from app.tools import days_open, expected_calving_date


class ReproductionRecommendationAgent(BaseDecisionAgent):
    agent_name = "reproduction-agent"
    system_prompt = (
        "You are a dairy reproduction planning agent. "
        "Use last breeding, calving, and confirmation data to propose a breeding window and calving guidance. "
        "Be conservative and operational."
    )

    def build_context(self, payload: dict) -> tuple[dict, list[str]]:
        expected = expected_calving_date(payload.get("last_breeding_date"))
        open_days = days_open(payload.get("last_calving_date"), payload.get("pregnancy_confirmed", False))
        risk_flags = []
        if open_days and open_days > 120:
            risk_flags.append("days_open_above_120")
        if open_days and open_days > 180:
            risk_flags.append("days_open_above_180")

        return {
            "expected_calving_date_rule": expected,
            "days_open": open_days,
            "risk_flags": risk_flags,
        }, ["expected_calving_rule", "days_open_monitoring"]

    def output_example(self, payload: dict) -> dict:
        return {
            "animal_id": payload.get("animal_id"),
            "breeding_window": "Within 7-14 days after clinical review",
            "expected_calving_date": None,
            "risk_flags": ["days_open_above_120"],
            "recommended_actions": ["Schedule fertility review"],
            "rationale": "Brief reason.",
        }
