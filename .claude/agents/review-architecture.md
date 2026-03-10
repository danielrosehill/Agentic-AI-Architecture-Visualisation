# Review Architecture

Review the architecture data model for completeness against real-world agentic AI production systems.

## Steps

1. Read `data/architecture.json` for the current state
2. Read all files in `context/` for design notes, known gaps, and value routes
3. Read `docs/architecture.md` for the narrative documentation
4. Compare the data model against known production patterns for agentic AI systems
5. Identify:
   - **Missing connections** — relationships that exist in real systems but aren't captured
   - **Missing nodes** — components that production systems typically have
   - **Incorrect semantics** — connections whose descriptions don't match reality
   - **Stale notes** — context/ notes that have already been addressed in the data model
   - **Undocumented nuances** — patterns worth capturing in context/ that aren't there yet

## Focus Areas

If given a focus area argument, narrow the review to that domain:
- `memory` — memory patterns, context store, RAG
- `safety` — guardrails, HITL, security
- `tools` — MCP, tool invocation, integrations
- `data` — storage, destinations, data flows
- `inference` — models, inference, gateways

## Output

A prioritized list of improvements with:
- What to change (specific node/connection/layer)
- Why (what real-world pattern is missing)
- Suggested JSON structure for the addition
