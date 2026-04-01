#!/usr/bin/env bash
# bg.sh — Run Claude Code in a tmux session for persistent background work
# Usage: .claude/commands/bg.sh "your task prompt here" [session-name]
#
# Features:
#   - Runs in tmux (persists when terminal closes)
#   - Max thinking effort (thorough)
#   - Bypass permission prompts (allowedTools='*')
#   - Auto-attaches if session exists
#
# Examples:
#   .claude/commands/bg.sh "Fix all TypeScript errors"
#   .claude/commands/bg.sh "Implement /tours page from Figma" meetup-tours

set -euo pipefail

PROMPT="${1:?Usage: bg.sh \"prompt\" [session-name]}"
SESSION="${2:-claude-bg-$(date +%H%M%S)}"
WORKDIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Check tmux
if ! command -v tmux &>/dev/null; then
  echo "Error: tmux not installed"
  exit 1
fi

# Kill existing session if same name
tmux kill-session -t "$SESSION" 2>/dev/null || true

# Create tmux session running Claude Code
tmux new-session -d -s "$SESSION" -c "$WORKDIR" \
  "claude --allowedTools '*' --model claude-opus-4-6 -p $(printf '%q' "$PROMPT"); echo '--- Done. Press any key ---'; read -n1"

echo "Started tmux session: $SESSION"
echo "  Attach:  tmux attach -t $SESSION"
echo "  Detach:  Ctrl+B, D"
echo "  Kill:    tmux kill-session -t $SESSION"
echo "  List:    tmux ls"
