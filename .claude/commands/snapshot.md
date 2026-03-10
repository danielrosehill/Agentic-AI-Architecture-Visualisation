Save the current architecture state as a named version snapshot.

Version name: $ARGUMENTS (e.g., "v2", "v2.1-memory-update")

1. Copy `data/architecture.json` to `context/versions/{name}-architecture.json`
2. Copy `data/schema.json` to `context/versions/{name}-schema.json`
3. Create `context/versions/{name}-notes.md` with:
   - Timestamp
   - Summary of what this version contains (count layers, nodes, connections)
   - What changed since the previous version (diff the connection/node counts)
4. Update `context/README.md` to list the new version
5. Report the snapshot location
