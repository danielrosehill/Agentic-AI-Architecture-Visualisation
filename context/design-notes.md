# Design Notes

Collected observations about how agentic AI architecture components actually relate to each other. These notes inform and constrain the data relationships in the architecture map — ensuring we capture real-world nuance rather than oversimplified flows.

---

## Agent Types and Tool Invocation

The connection from the agent layer to MCP/tools is **not uniform**. Different agent types have fundamentally different relationships with tools:

### Agents (Autonomous)
- The agent **autonomously decides** when and which tools to invoke.
- Tool selection is intelligent — the agent reasons about which tool fits the current sub-task.
- The flow is non-deterministic: the same input may produce different tool invocation sequences.
- Example: Claude Code deciding to read a file, then grep for a pattern, then edit — all based on reasoning.

### Pipelines (Deterministic)
- Tools are **wired in at design time** as fixed steps in the chain.
- There is no intelligent tool selection — each step rigidly calls a predetermined tool.
- The developer decides the tool sequence, not the model.
- Example: "Ingest document → chunk → embed → store in vector DB" — each step is hardcoded.

### Workflows (Deterministic / Event-Driven)
- Similar to pipelines: tools are **pre-configured** at each node in the workflow.
- Triggered by events rather than direct prompts.
- Branching may occur (if/else), but the tool at each branch is predetermined.
- Example: "On new email → classify with LLM → if urgent, send Slack notification → log to DB."

### Orchestration
- The meta-layer that routes between the above patterns.
- May intelligently select *which* pipeline or workflow to invoke, but the sub-components are still deterministic.

**Key distinction**: Agents have an *autonomous* relationship with tools. Pipelines and workflows have a *deterministic* relationship. This is arguably the defining difference between "agentic" and "automated" AI systems.

---

## Memory Patterns

Memory in agentic AI is not monolithic. There are distinct patterns for how memory is created, stored, and retrieved:

### 1. Mined Memory (Transport Layer)
- Outputs from agent runs are **post-processed** and stored in context/RAG systems.
- The agent doesn't "remember" — a separate pipeline extracts, indexes, and makes data retrievable.
- Memory here is a **transport layer**: outputs → storage → indexing → retrieval → future context.
- Example: Saving conversation summaries to a vector store, then retrieving relevant ones via RAG.

### 2. Ad-Hoc Memory (Agent-Managed)
- The agent **actively creates and retrieves** memory artifacts during execution.
- The agent decides what's worth remembering and writes it to persistent storage.
- Retrieval is also agent-initiated — the agent checks memory files when it deems relevant.
- Example: Claude Code's `MEMORY.md` — the agent writes notes and reads them in future sessions.

### 3. Implicit Memory (Context Window)
- Conversation history that persists within a session via the context window.
- Not truly "memory" in a persistent sense — lost when the session ends.
- The simplest form, but limited by context window size.

### 4. Structured Memory (Knowledge Graph / DB)
- Facts extracted from interactions and stored in structured form (triples, tables).
- Queryable via structured queries rather than semantic search.
- Example: Storing "user prefers dark mode" as a key-value pair, not an embedding.

**Key insight**: Mined memory treats storage as a transport layer between past and future runs. Ad-hoc memory gives the agent direct authorship over what it remembers. These are architecturally very different — the first is a pipeline concern, the second is an agent capability.

---

## Implications for the Data Model

These nuances suggest that the `agents-to-mcp` connection in the architecture should be broken out into separate connections with different semantics:

- `agents-node → mcp`: autonomous invocation (agent chooses tools)
- `pipelines → mcp`: deterministic invocation (developer wires tools)
- `workflows → mcp`: deterministic invocation (event-triggered, pre-configured tools)

Similarly, the memory/context-store relationships should distinguish:
- Storage → Context Store: mined memory (transport/pipeline pattern)
- Agents → Context Store: ad-hoc memory (agent-managed, bidirectional)
- Context window memory is implicit and doesn't need a connection (it's internal to the model)
