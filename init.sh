#!/usr/bin/env bash
set -euo pipefail

# One-time environment setup and integrity verification for vzla-sismo-feed.
# Run from anywhere; the script pins itself to the repo root.

# --- Setup ---

echo "==> Working directory: $(pwd)"

# Pin execution to the repo root regardless of where init.sh was invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "==> Repository root: $(pwd)"

echo "==> Checking Node.js version..."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "[FAIL] Node.js >= 20 required, found $(node -v)"
  exit 1
fi
echo "[OK] Node.js $(node -v)"

echo "==> Installing dependencies from lockfile..."
npm ci

# --- Verification ---

echo ""
echo "==> Running typecheck..."
npx tsc --noEmit
echo "[OK] Typecheck passed"

echo ""
echo "==> Running production build..."
npm run build
echo "[OK] Build passed"

echo ""
echo "==> Verifying PWA artifacts..."
if [ -f "public/sw.js" ]; then
  echo "[OK] public/sw.js exists"
else
  echo "[FAIL] public/sw.js not found after build"
  exit 1
fi

if [ -f "public/manifest.webmanifest" ] || [ -f "public/manifest.json" ]; then
  echo "[OK] PWA manifest exists"
else
  echo "[WARN] PWA manifest not found at public/manifest.{webmanifest,json}"
fi

echo ""
echo "==> All checks passed. Environment is ready."
