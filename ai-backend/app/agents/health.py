from app.agents.base import BaseDecisionAgent


class HealthRiskAgent(BaseDecisionAgent):
    agent_name = "health-risk-agent"
    system_prompt = (
        "You are a dairy health triage agent. "
        "Estimate operational risk from SCC, bacterial load, symptoms, temperature, and yield trend. "
        "Return a practical risk assessment for farm staff in JSON only."
    )

    def build_context(self, payload: dict) -> tuple[dict, list[str]]:
        scc = payload.get("scc") or 0
        recent_yields = payload.get("recent_milk_yield_litres") or []
        avg_yield = round(sum(recent_yields) / len(recent_yields), 2) if recent_yields else None
        baseline_risk = 25
        if scc > 200000:
            baseline_risk += 30
        if payload.get("temperature_c") and payload["temperature_c"] > 39.5:
            baseline_risk += 20
        if payload.get("symptoms"):
            baseline_risk += min(25, len(payload["symptoms"]) * 6)

        return {
            "rule_based_risk_score": min(100, baseline_risk),
            "recent_average_yield": avg_yield,
        }, ["scc_threshold_rule", "fever_rule", "symptom_count_rule"]

    def output_example(self, payload: dict) -> dict:
        return {
            "animal_id": payload.get("animal_id"),
            "risk_score": 68,
            "severity": "HIGH",
            "suspected_issues": ["Possible mastitis"],
            "recommended_actions": ["Inspect udder and isolate milk if needed"],
            "rationale": "Brief reason.",
        }
