# V1 — Carrot Cake AI Site Diagram

**Source**: `/home/daniel/repos/github/Carrot-Cake-AI-Site/website/src/components/ArchitectureDiagram.astro`
**Captured**: 2026-03-10

## What V1 Shows

A D3.js interactive diagram with three columns (left/center/right) and a vertical center flow:

```
Prompts → Models → Inference → Agents → MCP → HITL → Integrations → Storage → Context Store
```

**Side columns**: Frontends (left), Safety + Observability (right), Storage Destinations (right-lower)

**Feedback loop**: Context Store feeds back up to Agents (left-side curved arrow)

## What V1 Does NOT Capture

1. **Agent-to-tool invocation semantics** — single `Agents → MCP` arrow treats autonomous and deterministic invocation identically
2. **Memory patterns** — memory is a single node, no distinction between mined/ad-hoc/implicit/structured
3. **The agentic loop** — flow looks linear, but real agent execution is iterative (multiple model+tool calls per request)
4. **Bidirectional integration flow** — integrations only shown as action destinations, not data sources
5. **Orchestration wiring** — orchestration node exists but has no connections to agents/pipelines/workflows
6. **Tool discovery** — how agents learn what tools exist (MCP `tools/list`)
7. **Safety beyond agents** — safety only connects to agents, not to prompts (input filtering) or MCP (tool constraints)
8. **Observability to storage** — logs/traces not shown persisting anywhere
9. **Context injection into prompts** — RAG results need to reach the prompt layer, not just "agents"
10. **Model routing/gateway** — no representation of dynamic model selection

## Files

- `v1-ArchitectureDiagram.astro` — the D3.js diagram component (750 lines)
- `v1-architecture-page.astro` — the page wrapper
