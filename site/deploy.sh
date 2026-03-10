#!/usr/bin/env bash
# Deploy site/ contents to the Hugging Face Space.
# Usage: ./site/deploy.sh
#
# Requires: git, HF token in env or git credential store
# Space: https://huggingface.co/spaces/danielrosehill/The-Agentic-Symphony

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
HF_REPO="https://huggingface.co/spaces/danielrosehill/The-Agentic-Symphony"
WORK_DIR=$(mktemp -d)

echo "Cloning HF Space..."
git clone "$HF_REPO" "$WORK_DIR" 2>/dev/null || {
  echo "Clone failed. If auth issue, run: huggingface-cli login"
  exit 1
}

echo "Copying site files..."
cp "$SCRIPT_DIR/index.html" "$WORK_DIR/"
cp "$SCRIPT_DIR/style.css" "$WORK_DIR/"
cp "$SCRIPT_DIR/README.md" "$WORK_DIR/"

cd "$WORK_DIR"
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
else
  git commit -m "Update from architecture repo $(date +%Y-%m-%d)"
  git push origin main
  echo "Deployed successfully!"
fi

rm -rf "$WORK_DIR"
