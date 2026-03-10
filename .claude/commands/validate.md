Validate the architecture data in `data/architecture.json` against `data/schema.json`.

Perform all of the following checks and report results:

1. **JSON validity** — Parse `data/architecture.json` and confirm it is valid JSON.
2. **Schema conformance** — Validate the data against `data/schema.json`. Report any violations (missing required fields, wrong types, invalid enum values, pattern mismatches).
3. **Referential integrity** — For every connection in `connections`, verify that both `from` and `to` reference a valid node ID or layer ID defined in `layers`.
4. **Unique IDs** — Check that all layer IDs, node IDs, and connection IDs are unique (no duplicates across the entire file).
5. **Orphan nodes** — Identify any nodes that are not referenced by any connection (neither as `from` nor `to`). List them as warnings, not errors.
6. **Layer ordering** — Check for duplicate `order` values within the same `position` column.

Print a summary at the end: total layers, total nodes, total connections, number of errors found, number of warnings.
