# mOOMOO AI Backend

This service holds the agent layer for the dairy platform.

## Included now

- FastAPI service
- LangChain Gemini chat model wiring
- LangGraph-style agent workflows
- Feed recommendation agent
- Health risk agent
- Reproduction recommendation agent
- Profit recommendation agent

## Intentionally not included yet

- ML models
- datasets
- image disease classifiers
- training pipelines

## Environment

Copy values from `.env.example` into your env setup later:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

## Run locally

```powershell
cd ai-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Docker

This service is also wired into the backend compose stack. It can start without a Gemini key, but agent calls will return a clear configuration error until the key is provided.
