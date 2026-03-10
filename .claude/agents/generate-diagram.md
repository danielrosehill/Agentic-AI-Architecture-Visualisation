# Generate Diagram

Generate or update the D3.js visualization from the architecture data model.

## Steps

1. Read `data/architecture.json` for the current architecture state
2. Read `data/schema.json` for field definitions
3. Read `implementations/d3/diagram.js` and `implementations/d3/index.html` for existing viz code
4. Optionally read `context/versions/v1-ArchitectureDiagram.astro` for the Carrot Cake site's D3 implementation as reference
5. Update `implementations/d3/diagram.js` to:
   - Render all layers in three-column layout (left/center/right) ordered by `order`
   - Render nodes within each layer as chips/cards
   - Draw connections with appropriate styles:
     - `solid` lines for deterministic flows
     - `dashed` lines for data/feedback flows
     - `checkpoint` style for HITL
   - Distinguish `invocation_pattern` visually:
     - `autonomous` → animated/pulsing arrow
     - `deterministic` → solid straight arrow
     - `bidirectional` → double-headed arrow
     - `transport` → dashed with dots
   - Use layer colors from the data
   - Show labels on connections
   - Support hover tooltips from descriptions
   - Handle sub_items as small chips beneath layers
6. The diagram should be data-driven — read from architecture.json, not hardcoded

## Layout Rules

- Center column: layers with position "center", stacked top to bottom by order
- Left column: layers with position "left"
- Right column: layers with position "right"
- Connections between columns curve horizontally
- Connections within center column flow vertically
- Feedback loops (bottom to top) curve along the left edge
