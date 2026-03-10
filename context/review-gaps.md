# Architecture Review: Gaps and Improvements

Full review of the architecture data model against production agentic AI systems. These findings should inform V2 of the data model.

---

## Priority 1: Structural Gaps

### 1. Orchestration Is Orphaned
The `orchestration` node has zero connections. It should dispatch to `agents-node`, `pipelines`, and `workflows`. Without this, the routing function is invisible.

**Fix**: Add connections `orchestration → agents-node`, `orchestration → pipelines`, `orchestration → workflows`.

### 2. Integrations Are Unidirectional
The model only shows agents acting *on* external systems (write path). But agents also *read from* integrations (query CRM, fetch documents). The read path is arguably more common.

**Fix**: Add a return path `integrations → mcp-protocol` for data retrieval, or annotate the existing connections as bidirectional.

### 3. The Agentic Loop Is Invisible
The linear flow doesn't convey that agent execution is iterative. The agent calls models and tools *repeatedly* in a loop. This loop is the defining characteristic of agentic systems.

**Fix**: Add a note/annotation or a visual loop indicator on the `agents-node → mcp` connection. The `inference-to-agents` connection is also traversed repeatedly per request.

---

## Priority 2: Missing Connections

### 4. Safety Applied Too Narrowly
Safety only connects to agents. In production, guardrails also apply to:
- **Prompts** (input filtering, injection detection)
- **MCP** (restricting which tools can be called)
- **Model outputs** before reaching frontends

**Fix**: Add `safety-card → prompts` and `safety-card → mcp-protocol`.

### 5. Observability to Storage
Observability data (traces, logs, eval results) must be persisted. No connection exists.

**Fix**: Add `observability-card → storage` (or specifically `→ data-lakes`).

### 6. Context Injection into Prompts
RAG results get injected into prompts — that is literally what RAG does. The current `context-to-agents` connection elides how context actually enters the model.

**Fix**: Add `context-store → prompts` (or `context-rag → system-prompt`).

### 7. Eval Feedback to Prompts
No feedback loop from eval results to prompt optimization.

**Fix**: Add `observability-card → stored-prompts` labeled "PROMPT OPTIMIZATION".

### 8. Frontends to Observability
Client-side telemetry and user feedback (thumbs up/down) flow to observability. Missing.

**Fix**: Add `frontends-card → observability-card`.

---

## Priority 3: Missing Nodes

### 9. Model Gateway / Router
Production systems almost universally have a model gateway (LiteLLM, Portkey, OpenRouter) for model selection, load balancing, fallback, rate limiting, and cost tracking.

**Option**: Add as a node in the `inference` layer, or between `models` and `inference`.

### 10. Caching Layer
Prompt caching (semantic dedup), response caching, embedding caching — critical for cost and latency.

**Option**: Node in `inference` or a cross-cutting concern.

### 11. Embedding Models
The models layer doesn't distinguish LLMs from embedding models. Embedding models power the vector store and RAG pipeline, not agent reasoning.

**Option**: Add "Embedding Models" node in `models` layer connecting to `vector-store`.

### 12. Tool Registry / Discovery
How agents learn what tools exist. In MCP this is `tools/list`. Too many tools degrade performance; tool descriptions are effectively prompts.

**Option**: Sub-item of MCP, or a separate node.

---

## Priority 4: Nuance Annotations

### 13. HITL Varies by Agent Type
- **Agents**: per-action approval (agent proposes tool call, human approves)
- **Pipelines**: stage-gate approval (review output before next stage)
- **Workflows**: exception-based (human notified only on low confidence)

### 14. MCP Is Overloaded
MCP currently conflates tool invocation, resource access, and prompt template serving (all three are MCP capabilities per spec). The single node doesn't capture this.

### 15. Prompt Assembly Is Complex
The `prompts → models` connection hides: template rendering, context injection, tool definition injection, conversation history, token budget allocation.

### 16. Error Handling Differs
- Agents: self-healing, intelligent retries
- Pipelines: mechanical retries, circuit breakers
- Workflows: human escalation, fallback branches

### 17. Multi-Agent Communication
The single `agents-node` doesn't address multi-agent topologies: shared blackboard, message passing, supervisor/worker, debate patterns.

### 18. Idempotency Matters
Tool invocations have different safety profiles: reads vs writes, idempotent vs non-idempotent. This should inform HITL and safety design.
