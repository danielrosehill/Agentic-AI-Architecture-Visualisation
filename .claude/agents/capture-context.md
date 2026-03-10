# Capture Context

Capture a design note or architectural insight into the context store.

## Steps

1. Take the user's input — which may be informal, messy, or stream-of-consciousness
2. Read existing files in `context/` to understand what's already documented and avoid duplication
3. Determine the best home for the note:
   - Does it extend an existing topic in `context/design-notes.md`?
   - Is it about a gap/improvement? → `context/review-gaps.md`
   - Is it about a value route? → `context/value-routes.md`
   - Is it a new topic? → Create a new file in `context/`
4. Clean up and format the note:
   - Fix typos and grammar
   - Structure with markdown headers
   - Preserve the original insight and voice — don't over-sanitize
5. If the note has implications for the data model, add an "Implications" section noting what connections or nodes might need updating
6. Write/update the appropriate context file
7. Report what was captured and where
