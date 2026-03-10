# Agentic AI Architecture — The Moving Pieces

This document describes each layer and connection in the architecture map. The canonical data lives in [`data/architecture.json`](../data/architecture.json); this document provides the narrative explanation.

## Layout

The diagram uses a three-column layout:

| Left | Center | Right |
|------|--------|-------|
| Frontends | Core pipeline (top → bottom) | Safety & Observability |

The center column is the primary flow. The left and right columns represent cross-cutting concerns that connect horizontally into the center.

---

## Layers (top to bottom)

### 1. Prompts
The instruction layer where human intent enters the system. Three distinct prompt types combine before reaching the model:

- **User Prompt** — the end user's question or instruction
- **System Prompt** — developer-defined behavioral instructions
- **Vendor Prompt** — hidden provider-level directives (RLHF alignment, safety guardrails). The model is never truly "vanilla," even via raw API.

### 2. Models
The foundation models that power reasoning and generation:

- **Commercial** — proprietary frontier models (Claude, GPT, Gemini)
- **Open Source** — open-weight models (Llama, Mistral, Qwen, DeepSeek)
- **Fine-Tuned** — task-specific models trained on your data

### 3. Inference
Where and how models are served:

- **Cloud APIs** — hosted endpoints (Anthropic, OpenAI, Bedrock)
- **Self-Hosted** — your own servers (vLLM, TGI, Ollama)
- **On-Prem** — air-gapped data center deployments
- **Edge** — lightweight models on devices

### 4. Agents (Backend)
The orchestration and execution layer:

- **Orchestration** — routing, failure handling, state management
- **Agents** — autonomous systems that reason, plan, and act
- **Pipelines** — multi-step data processing chains
- **Workflows** — automated sequences triggered by events

### 5. MCP (Model Context Protocol)
The open standard for connecting AI models to external tools, services, and data sources. Acts as the universal adapter between agents and the outside world.

### 6. Human-in-the-Loop
Approval checkpoints where humans review and authorize agent actions before execution. This is the braking mechanism — especially critical for actions with real-world consequences.

### 7. Integrations
External systems that agents connect to (typically via MCP):

- **Your Data** — Salesforce, HubSpot, Google Drive, Notion
- **Search APIs** — web search, news feeds, real-time data
- **External Services** — weather, time, public datasets

### 8. Storage
The persistence layer:

- **Conversations** — stored threads for auditing and replay
- **Outputs** — generated text, files, and artifacts
- **Prompts** — versioned prompt templates and libraries
- **Postgres** — relational databases for structured data
- **Data Lakes** — large-scale unstructured storage

### 9. Context Store
The knowledge layer that creates a feedback loop:

- **Context (RAG)** — retrieval-augmented generation from your documents
- **Memory** — persistent conversation history and learned facts
- **Vector Store** — embedding-based indexes for semantic search over documents and database records

---

## Destinations (Left Column)

These represent what you do with the data you save — the downstream consumers of stored outputs:

- **Prompt Library** — curated, versioned prompt templates drawn from stored prompts for reuse across systems
- **Wiki / KM** — organizational knowledge management (Notion, Confluence, wikis) populated with curated agent outputs
- **Data Warehouse** — structured analytical storage for data mining, compliance auditing, and long-term retention

---

## Side Columns

### Frontends (Left)
The user-facing interfaces: chatbots, Slack/Telegram bots, web UIs, and dashboards. Frontends send **input** to the prompt layer and receive **output** from the agent layer.

### Safety (Right)
Guardrails and security harnesses that constrain agent behavior.

### Observability (Right)
Evaluation, logging, and monitoring systems that track agent decisions and health.

---

## Connections

### Primary Flow (vertical, center)
```
Prompts → Models → Inference → Agents → MCP → HITL → Integrations
```

### Data Persistence (side path)
```
Agents ──(dashed)──→ Storage ──(context-mining)──→ Context Store ──(feedback)──→ Agents
```
This creates a virtuous cycle: agents persist data, which is mined for context, which feeds back into future agent runs.

### Storage Destinations (downstream)
```
Stored Prompts ──→ Prompt Library
Outputs ──→ Wiki / KM
Outputs ──→ Data Warehouse  (data mining + compliance)
Postgres ──→ Vector Store    (structured data → embeddings → RAG)
```

### Cross-cutting (horizontal)
```
Frontends ──(input)──→ Prompts
Agents ──(output)──→ Frontends
Safety ──→ Agents
Observability ──→ Agents
```

### Key Labels
- **INPUT** — user requests flowing from frontends to prompts
- **OUTPUT** — agent responses flowing back to frontends
- **TAKING ACTIONS** — the transition from MCP to human approval
- **CONTEXT-MINING** — stored data being indexed into the context store
