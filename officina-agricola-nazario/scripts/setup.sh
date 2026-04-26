#!/bin/bash
# Setup Officina Agricola Nazario — Agri-Planner
set -e

echo "🌾 Officina Agricola Nazario — Setup"
echo "======================================"

cd "$(dirname "$0")/../app"

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  cd app && npm run dev"
echo ""
echo "To build for production:"
echo "  cd app && npm run build"
