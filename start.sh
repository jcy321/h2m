#!/bin/bash

# H2M - HTML to Markdown Converter
# Startup script

set -e

echo "╔════════════════════════════════════════╗"
echo "║     H2M - HTML to Markdown Converter   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

# Check if we should build
if [ "$1" = "--build" ] || [ ! -d "dist" ]; then
    echo "🔨 Building project..."
    bun run build
fi

# Start the server
echo "🚀 Starting server on port ${PORT:-3000}..."
echo ""
bun run start