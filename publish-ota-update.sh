#!/bin/bash

# Simple OTA Update Publisher for Akariza Mobile App
# Usage: ./publish-ota-update.sh

set -e

echo "🚀 Publishing OTA Update..."
echo ""

# Check if EXPO_TOKEN is set
if [ -z "$EXPO_TOKEN" ]; then
  echo "❌ Error: EXPO_TOKEN environment variable is not set"
  echo "Set it with: export EXPO_TOKEN='your_token_here'"
  exit 1
fi

echo "✅ EXPO_TOKEN is set"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --legacy-peer-deps
  echo ""
fi

# Publish the update
echo "📤 Publishing to Expo..."
npx expo-cli@latest publish --release-channel production

echo ""
echo "✅ OTA Update published successfully!"
echo ""
echo "Your app will receive the update on next load."
echo "To test immediately:"
echo "  1. Close the app completely"
echo "  2. Reopen the app"
echo "  3. The app will check for updates and apply them"
