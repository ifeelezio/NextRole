#!/usr/bin/env bash
# One-shot macOS setup (Apple Silicon and Intel). Safe to re-run.
set -euo pipefail

cd "$(dirname "$0")/.."

say() { printf "\n==> %s\n" "$1"; }

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is for macOS. On other systems run: npm install" >&2
  exit 1
fi

say "Checking Homebrew"
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is not installed. Install it from https://brew.sh, then re-run: npm run setup" >&2
  exit 1
fi

say "Checking Node.js (needs >= 20.9)"
need_node=true
if command -v node >/dev/null 2>&1; then
  major="$(node -p 'process.versions.node.split(".")[0]')"
  minor="$(node -p 'process.versions.node.split(".")[1]')"
  if (( major > 20 || (major == 20 && minor >= 9) )); then need_node=false; fi
fi
if $need_node; then
  echo "Installing Node 22 with Homebrew..."
  brew install node@22
  brew link --overwrite --force node@22
fi
echo "Using Node $(node -v) on $(uname -m)"

say "Installing dependencies"
if [[ -f package-lock.json ]]; then npm ci; else npm install; fi

say "Preparing .env.local"
if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Created .env.local. Fill in your Supabase and OpenAI values."
else
  echo ".env.local already exists, leaving it alone."
fi

say "Done"
echo "Next: run supabase/schema.sql in the Supabase SQL editor, edit .env.local, then: npm run dev"
