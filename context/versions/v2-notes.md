# V2 — Full Architecture Review

**Date**: 2026-03-10

## Stats
- Layers: 13
- Nodes: 37 (up from 33)
- Connections: 36 (up from 20)

## What Changed

### New Nodes
- `embedding-models` — architecturally distinct from generative LLMs
- `model-gateway` — model router (OpenRouter / LiteLLM)
- `prompt-cache` — cost/latency caching layer
- `tool-registry` — MCP tool discovery mechanism

### New Connections (16 added)
- Orchestration wired to agents/pipelines/workflows (was orphaned)
- Agentic loop (agents → inference) — iterative execution
- Bidirectional integrations (data retrieval path)
- Safety applied to prompts and MCP (not just agents)
- Observability to storage and prompt optimization
- Frontends to observability (user feedback)
- Context RAG injection into system prompt
- Embedding models to vector store
- Gateway routing to cloud APIs and self-hosted
- User prompt capture and conversation mining for user context

### Key Design Decisions
- Gateway routing pattern: gateway sits at top of inference layer, routes to cloud/self-hosted endpoints
- Invocation patterns formalized: autonomous, deterministic, bidirectional, transport
- HITL varies by agent type: per-action, stage-gate, exception-based

## Visualization
Interactive site deployed to HF Space: The Agentic Symphony
