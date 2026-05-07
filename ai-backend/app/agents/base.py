import json
from typing import Any, TypedDict

from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import END, StateGraph

from app.config import settings
from app.llm import get_llm


class AgentState(TypedDict, total=False):
    payload: dict[str, Any]
    context: dict[str, Any]
    raw_response: str
    result: dict[str, Any]


class BaseDecisionAgent:
    agent_name = "base-agent"
    system_prompt = ""

    def build_context(self, payload: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
        return {}, []

    def output_example(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {"animal_id": payload.get("animal_id")}

    def build_graph(self):
        graph = StateGraph(AgentState)
        graph.add_node("context", self._context_node)
        graph.add_node("reason", self._reason_node)
        graph.add_node("parse", self._parse_node)
        graph.set_entry_point("context")
        graph.add_edge("context", "reason")
        graph.add_edge("reason", "parse")
        graph.add_edge("parse", END)
        return graph.compile()

    def invoke(self, payload: dict[str, Any]) -> dict[str, Any]:
        app = self.build_graph()
        state = app.invoke({"payload": payload})
        result = state["result"]
        result["meta"] = {
            "agent_name": self.agent_name,
            "model": settings.gemini_model,
            "used_rules": state["context"].get("used_rules", []),
        }
        return result

    def _context_node(self, state: AgentState) -> AgentState:
        derived_context, used_rules = self.build_context(state["payload"])
        return {"context": {"derived": derived_context, "used_rules": used_rules}}

    def _reason_node(self, state: AgentState) -> AgentState:
        llm = get_llm()
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", self.system_prompt),
                (
                    "human",
                    "Payload:\n{payload}\n\nDerived context:\n{context}\n\n"
                    "Return only valid JSON matching this shape example:\n{shape}",
                ),
            ]
        )
        chain = prompt | llm
        response = chain.invoke(
            {
                "payload": json.dumps(state["payload"], default=str, indent=2),
                "context": json.dumps(state["context"]["derived"], default=str, indent=2),
                "shape": json.dumps(self.output_example(state["payload"]), default=str, indent=2),
            }
        )
        return {"raw_response": response.content}

    def _parse_node(self, state: AgentState) -> AgentState:
        content = state["raw_response"]
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        return {"result": json.loads(cleaned)}
