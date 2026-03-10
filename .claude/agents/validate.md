# Validate Architecture Data

Validate the architecture data model for correctness and integrity.

## Steps

1. Read `data/architecture.json` and `data/schema.json`
2. Verify the JSON is valid and parseable
3. Check schema conformance — every required field is present, types are correct, enum values are valid
4. **Referential integrity**: Every connection's `from` and `to` must reference either a layer ID or a node ID that exists in the layers array. Collect all valid IDs first, then check every connection.
5. **Orphan detection**: Find nodes that have zero connections (neither `from` nor `to` references them). Report these as warnings — they may be intentional but are worth flagging.
6. **Duplicate ID check**: No two layers, nodes, or connections should share the same ID.
7. **Color format**: All color fields should match `^#[0-9a-fA-F]{6}$`
8. **Connection completeness**: Every connection should have a description.

## Output

Report results as a structured summary:
- Total layers, nodes, connections
- Validation errors (blocking)
- Warnings (non-blocking, e.g. orphan nodes)
- A clean/dirty verdict
