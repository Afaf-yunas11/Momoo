from app.agents.base import BaseDecisionAgent
from app.tools import calculate_thi, heat_stress_band


class FeedRecommendationAgent(BaseDecisionAgent):
    agent_name = "feed-recommendation-agent"
    system_prompt = (
        "You are a dairy feed optimization agent for a smart farm system. "
        "Use the payload and derived context to recommend a practical daily feed quantity in kg. "
        "Do not mention training data, and do not invent sensors or lab results. "
        "Return concise operational guidance."
    )

    def build_context(self, payload: dict) -> tuple[dict, list[str]]:
        thi = calculate_thi(payload.get("temperature_c"), payload.get("humidity_pct"))
        stress_band = heat_stress_band(thi)
        base_qty = payload.get("current_feed_qty_kg") or 12.0
        if stress_band == "moderate":
            base_qty += 1.0
        elif stress_band == "severe":
            base_qty += 1.5
        elif (payload.get("milk_yield_litres") or 0) > 20:
            base_qty += 1.0

        return {
            "thi": thi,
            "heat_stress_band": stress_band,
            "rule_based_starting_point_qty_kg": round(base_qty, 2),
        }, ["thi_calculation", "heat_stress_adjustment", "yield_adjustment"]

    def output_example(self, payload: dict) -> dict:
        return {
            "animal_id": payload.get("animal_id"),
            "recommended_qty_kg": 13.5,
            "rationale": "Brief reason.",
            "adjustments": ["Increase water access."],
            "alerts": ["Moderate heat stress."],
        }
