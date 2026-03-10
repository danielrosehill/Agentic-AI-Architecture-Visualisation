# Agentic AI Architecture — The Moving Pieces (V2)

The canonical data lives in [`data/architecture.json`](../data/architecture.json). Interactive visualization at [The Agentic Symphony](https://huggingface.co/spaces/danielrosehill/The-Agentic-Symphony).

## Layout

Three-column layout:

| Left | Center | Right |
|------|--------|-------|
| Frontends, Destinations | Core pipeline (top → bottom) | Safety, Observability |

---

## Layers

### 1. Prompts
Three prompt types combine before reaching the model. Prompt assembly is complex: template rendering, RAG context injection, tool definitions, conversation history, token budget allocation.

- **User Prompt** — end user's instruction
- **System Prompt** — developer-defined behavior + RAG context injection point
- **Vendor Prompt** — hidden provider directives (RLHF, safety)

### 2. Models
- **Commercial** — Claude, GPT, Gemini, Cohere
- **Open Source** — Llama, Mistral, Qwen, DeepSeek, Phi
- **Fine-Tuned** — task-specific on your data
- **Embedding** *(V2)* — architecturally distinct from generative LLMs; powers vector store and RAG

### 3. Inference
- **Gateway** *(V2)* — model router (OpenRouter hosted, LiteLLM self-hosted). Routes to cloud or local endpoints based on model selection, cost, latency, fallback rules
- **Cloud APIs** — Anthropic, OpenAI, Google, Bedrock
- **Self-Hosted** — vLLM, TGI, Ollama
- **On-Prem** — air-gapped
- **Edge** — on-device, offline
- **Cache** *(V2)* — prompt/response caching for cost and latency

### 4. Agents (Backend)
Different agent types have fundamentally different relationships with tools:

- **Orchestration** — dispatches to agents, pipelines, or workflows *(V2: now wired with connections)*
- **Agents** — autonomous, non-deterministic tool invocation. **Execution is a loop** *(V2: agentic loop connection)*
- **Pipelines** — deterministic, developer-wired tool steps
- **Workflows** — event-triggered, pre-configured tools

> **Key distinction**: Agents = autonomous. Pipelines/Workflows = deterministic. This is the line between "agentic" and "automated."

### 5. MCP (Model Context Protocol)
- **Model Context Protocol** — the open standard
- **Tool Registry** *(V2)* — discovery mechanism (tools/list). Tool descriptions are effectively prompts

### 6. Human-in-the-Loop
Pattern varies: per-action (agents), stage-gate (pipelines), exception-based (workflows).

### 7. Integrations
Bidirectional *(V2)*: agents both read from and write to external systems.

### 8. Storage
Conversations, Outputs, Prompts, Postgres, Data Lakes.

### 9. Context Store
- **Context (RAG)** — injected into system prompt *(V2: explicit CONTEXT INJECTION connection)*
- **Memory** — mined, ad-hoc, implicit, structured
- **Vector Store** — fed by embedding models *(V2: explicit connection)*

---

## V2 Changes

### New Nodes (6)
- `embedding-models` — distinct from generative LLMs
- `model-gateway` — routing, load balancing, failover
- `prompt-cache` — cost/latency reduction
- `tool-registry` — tool discovery mechanism

### New Connections (16)
| Connection | Type | What it captures |
|---|---|---|
| `orchestration → agents/pipelines/workflows` | dashed | Orchestration now dispatches properly |
| `agentic-loop` (agents → inference) | autonomous | Iterative agent execution |
| `integrations → mcp-protocol` | bidirectional | Data retrieval (not just actions) |
| `safety → prompts` | dashed | Input guardrails |
| `safety → mcp-protocol` | dashed | Tool-level safety |
| `observability → data-lakes` | dashed | Log/trace persistence |
| `observability → stored-prompts` | dashed | Prompt optimization feedback |
| `frontends → observability` | dashed | User feedback/telemetry |
| `context-rag → system-prompt` | dashed | RAG context injection |
| `embedding-models → vector-store` | dashed | Embedding → semantic search |
| `gateway → cloud-apis` | solid | Gateway routing pattern |
| `gateway → self-hosted` | solid | Gateway routing pattern |
| `user-prompt → conversations` | dashed | Prompt capture for mining |
| `conversations → postgres` | dashed | User context mining pipeline |

### V1 → V2 Summary
- Layers: 13 → 13 (same, but enriched)
- Nodes: 33 → 37
- Connections: 20 → 36
