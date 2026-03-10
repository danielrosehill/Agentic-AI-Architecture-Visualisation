Add a new node to the architecture.

User input: $ARGUMENTS

If the user provided details in their arguments, use them. Otherwise, prompt for the following:
- **Layer**: Which existing layer should this node belong to? (list available layers from `data/architecture.json`)
- **Node ID**: A kebab-case unique identifier (e.g., `my-new-node`)
- **Label**: Display name for the node
- **Description**: What this node represents in the architecture

Steps:
1. Read `data/architecture.json` to get the current state.
2. Verify the node ID is unique across all layers.
3. Add the new node to the specified layer's `nodes` array.
4. Write the updated `data/architecture.json` (preserve formatting: 2-space indent).
5. Update `docs/architecture.md` to include the new node in the appropriate section.
6. Run a quick validation: confirm the JSON is still valid and the node ID is unique.
7. Report what was added and where.
