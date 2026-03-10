Run a comprehensive architecture review of `data/architecture.json`.

Optional focus area: $ARGUMENTS

If a focus area is provided (e.g., "memory", "safety", "connections", "layers", "agents"), concentrate the review on that area. Otherwise, review the full architecture.

Perform the following:

1. **Read** `data/architecture.json`, `data/schema.json`, and relevant files in `context/` for background.
2. **Structural review** — Are layers well-organized? Are there missing layers that a production agentic system would typically need?
3. **Connection review** — Are connections complete? Look for missing logical connections between nodes. Are invocation patterns used consistently?
4. **Description quality** — Are node and layer descriptions clear, accurate, and sufficiently detailed?
5. **Gaps and recommendations** — What architectural components are missing or underrepresented? Suggest specific additions.
6. **Consistency** — Check naming conventions, color usage, style consistency across the data model.

Present findings organized by category with specific, actionable recommendations. Reference node and connection IDs when discussing specific items.
