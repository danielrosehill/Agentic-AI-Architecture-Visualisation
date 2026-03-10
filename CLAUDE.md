# Agentic AI Architecture Map

## What This Repo Is

A framework-agnostic data model describing all the moving pieces of a production agentic AI system. The canonical data is in `data/architecture.json`, validated by `data/schema.json`.

## Key Directories

- `data/` — The canonical JSON data model and schema
- `context/` — Design notes, gap analysis, value routes that inform the data model
- `context/versions/` — Snapshots of each data model iteration
- `docs/` — Repo documentation (not visualization)
- `.claude/agents/` — Subagents for validation, review, adding components, capturing context, generating diagrams
- `.claude/commands/` — Slash commands: `/validate`, `/review`, `/add-node`, `/add-connection`, `/capture`, `/snapshot`, `/diff-versions`, `/stats`

## Visualization

The interactive visualization source lives in `site/` within this repo:
- **Source**: `site/index.html`, `site/style.css`, `site/README.md`
- **Deploy**: `./site/deploy.sh` pushes to the HF Space
- **Live**: https://huggingface.co/spaces/danielrosehill/The-Agentic-Symphony

When the data model changes, update the embedded ARCH data in `site/index.html` and run the deploy script.

## Conventions

- Node IDs: kebab-case (e.g., `model-gateway`, `tool-registry`)
- Connection IDs: descriptive (e.g., `agents-autonomous-to-mcp`, `safety-to-prompts`)
- Colors: inherit from source layer's color hex
- Every node and connection must have a `description`
- Use `invocation_pattern` on connections where semantically meaningful: `autonomous`, `deterministic`, `bidirectional`, `transport`

## Workflow

1. Capture design notes in `context/` first
2. Update `data/architecture.json`
3. Run `/validate` to check integrity
4. Update `docs/architecture.md`
5. Snapshot with `/snapshot v2.x`
6. Update HF Space visualization
