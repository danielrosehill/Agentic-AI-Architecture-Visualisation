# Add Component

Add a new node or connection to the architecture data model.

## Steps

1. Read `data/architecture.json` and `data/schema.json`
2. Understand what the user wants to add from their description
3. Determine if it's a **node** (goes inside a layer) or a **connection** (links two IDs)
4. For nodes:
   - Identify which layer it belongs to
   - Generate an ID following the kebab-case convention used in existing nodes
   - Check for ID conflicts with existing nodes
   - Add the node to the appropriate layer in architecture.json
5. For connections:
   - Verify both `from` and `to` IDs exist in the data
   - Choose appropriate style (solid/dashed), color (match the source layer's color), and invocation_pattern if applicable
   - Add the connection to the connections array
6. Update `docs/architecture.md` to reflect the change — add the new component to the appropriate section
7. Report what was added

## Conventions

- Node IDs: kebab-case, descriptive (e.g., `model-gateway`, `tool-registry`)
- Connection IDs: `{from}-to-{to}` or descriptive (e.g., `safety-to-prompts`)
- Colors: inherit from the source layer's color
- Every node and connection must have a description
