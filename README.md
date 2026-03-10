# Agentic AI Architecture Map

A framework-agnostic data model mapping all the moving pieces of a production agentic AI system — from prompts to models to agents to storage and back.

![License](https://img.shields.io/badge/license-MIT-blue)

## What Is This?

Building with agentic AI means wiring together many components: models, inference infrastructure, orchestration frameworks, tool protocols, safety guardrails, storage, and feedback loops. This repo provides:

1. **A canonical data model** (`data/architecture.json`) describing every layer, node, and connection
2. **A JSON Schema** (`data/schema.json`) so the data model is validatable and extensible
3. **Documentation** (`docs/architecture.md`) explaining what each piece does and how they connect
4. **Reference implementations** in specific visualization frameworks

The idea: define the relationships once, render them anywhere.

## Repository Structure

```
data/
  architecture.json    ← The canonical data model
  schema.json          ← JSON Schema for validation
docs/
  architecture.md      ← Narrative documentation of every layer and connection
implementations/
  d3/                  ← D3.js interactive SVG implementation
    index.html
    diagram.js
```

## The Architecture at a Glance

```
                    ┌─────────────┐
                    │   Prompts   │ ← User + System + Vendor
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Models    │ ← Commercial / Open Source / Fine-Tuned
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
  Frontends ──INPUT→│  Inference  │ ← Cloud / Self-Hosted / On-Prem / Edge
                    └──────┬──────┘
                           │
  Safety ──────────→┌──────▼──────┐
  Observability ───→│   Agents    │←OUTPUT→ Frontends
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     MCP     │ ← Model Context Protocol
                    └──────┬──────┘
                           │ TAKING ACTIONS
                    ┌──────▼──────┐
                    │    HITL     │ ← Human-in-the-Loop approval
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Integrations│ ← Your Data / APIs / Services
                    └─────────────┘
                           │
              Agents ─────→│
                    ┌──────▼──────┐
                    │   Storage   │ ← Conversations / Outputs / Postgres / Data Lakes
                    └──────┬──────┘
                           │ CONTEXT-MINING
                    ┌──────▼──────┐
                    │Context Store│ ← RAG + Memory ──feedback──→ Agents
                    └─────────────┘
```

## Using the Data Model

The `data/architecture.json` file is the single source of truth. It contains:

- **`layers`** — each architectural layer with its position, color, and child nodes
- **`connections`** — directed edges between layers/nodes with labels and styles

You can build your own renderer by reading this JSON and mapping it to any visualization library (D3, Mermaid, React Flow, Cytoscape, etc.).

### Validation

```bash
# With ajv-cli
npx ajv validate -s data/schema.json -d data/architecture.json
```

## Running the D3 Implementation

```bash
# From the repo root
npx serve .
# Open http://localhost:3000/implementations/d3/
```

The D3 implementation loads `data/architecture.json` at runtime and renders an interactive SVG with zoom, pan, and tooltips.

## Contributing

PRs welcome — especially for:
- New visualization implementations (Mermaid, React Flow, Cytoscape, etc.)
- Corrections or additions to the architecture model
- Better documentation of individual layers

## License

MIT

## Author

Daniel Rosehill — [Carrot Cake AI](https://carrotcakeai.com)
