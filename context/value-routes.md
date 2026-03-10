# Overlooked Value Routes

These are data pathways through the architecture that are simple but deliver outsized value — and are typically underrepresented (or invisible) in architecture diagrams.

---

## 1. Prompts → Prompt Library

**The route**: User prompts and system prompts are captured, curated, and stored in a versioned prompt library for reuse.

**Why it's overlooked**: It seems trivially simple — just "save the prompt." But in practice, a curated prompt library becomes one of the most valuable assets in an agentic system. Good prompts are discovered through use, not designed upfront.

**The value**:
- Prompts that work well in production are identified through observation
- They get versioned, tagged, and made reusable across agents and contexts
- New agents and workflows can bootstrap from proven prompts instead of starting from scratch
- It's a form of institutional knowledge — "this is how we talk to models about X"

**Current status in data model**: Partially captured (`stored-prompts → prompt-library`), but the *origin* from live user/system prompts is not explicit. The route should be: `user-prompt / system-prompt → stored-prompts → prompt-library`.

---

## 2. Prompts → Production DB → Context-Mining Workflow → Vector DB → Enriched Conversations

**The route**: Prompts (the actual conversations with users) are persisted to a production database. A separate agentic workflow is responsible for mining these stored prompts for context data *about the user* — preferences, patterns, domain knowledge, communication style. This extracted context feeds into a vector database, which then enriches future conversations with better, more personalized context.

**Why it's overlooked**: Most architecture diagrams show RAG as "documents → embeddings → retrieval." They miss that *the conversations themselves* are a rich source of user context. The prompts aren't just inputs — they're data about who the user is and what they care about.

**The value**:
- Every conversation teaches the system about the user
- Over time, the agent gets progressively better at understanding context, preferences, and intent
- This is *not* just conversation history replay — it's active mining for structured insights
- The mining workflow is itself agentic: it uses LLMs to extract, categorize, and index the context

**The full path**:
```
user-prompt → conversations (storage) → postgres → [context-mining agentic workflow] → vector-store → context-rag → prompts (injected as context)
```

**What makes this different from generic "context-mining"**:
- It's specifically mining *prompts/conversations* (not arbitrary outputs)
- The mining step is intelligent (uses an LLM to extract user context, not just raw embedding)
- The enrichment is *per-user* — building a profile of each user's needs over time
- The loop is virtuous: better context → better responses → richer conversations → better context

**Current status in data model**: The generic `storage → context-store` connection with "CONTEXT-MINING" label exists, but it doesn't distinguish this specific high-value route from generic document indexing. The mining workflow (which is itself agentic) is not represented.

---

## 3. Outputs → Knowledge Management → Organizational Learning

**The route**: Agent outputs (research summaries, analyses, recommendations) are curated and published to organizational knowledge bases (wikis, Confluence, Notion).

**Why it matters**: Every agent interaction potentially generates organizational knowledge. Without this route, that knowledge is trapped in individual conversation threads and lost.

**Current status**: Captured as `outputs → wiki-km`, but worth noting that this should be a curated flow (not every output goes to the wiki — there's a quality/relevance filter).

---

## Implications for the Data Model

These routes suggest we need:

1. **Explicit prompt capture connections**: `user-prompt → conversations` and `system-prompt → stored-prompts` (currently implicit)
2. **A "context-mining workflow" node**: A specialized agentic workflow that mines conversations for user context — distinct from generic storage-to-context indexing
3. **Per-user context** as a concept in the memory/context-store layer
4. **The prompt library feedback loop**: Effective prompts discovered in production feed back into system prompts for future agents

### Proposed New Connections

```
user-prompt ──→ conversations        (prompt persistence)
conversations ──→ postgres           (structured storage)
postgres ──→ [mining-workflow] ──→ vector-store  (intelligent context extraction)
vector-store ──→ context-rag ──→ system-prompt   (context injection)
```

This creates a second virtuous cycle, distinct from the general context-mining loop:
- **General loop**: agents → storage → context-store → agents (output-driven)
- **User context loop**: prompts → DB → mining workflow → vector DB → prompts (conversation-driven)
