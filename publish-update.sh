#!/bin/bash

# Akariza OTA Update Publisher
# This script publishes updates to installed apps without rebuilding

echo "🚀 Akariza OTA Update Publisher"
echo "==============================="
echo ""

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if logged in
echo "📝 Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS. Please login:"
    eas login
fi

echo ""
echo "📦 Publishing update..."
echo ""
echo "This will:"
echo "1. Bundle your JavaScript code"
echo "2. Upload to Expo's servers"
echo "3. Make it available to all installed apps"
echo ""

# Publish update to preview channel
eas update --branch preview --message "$(git log -1 --pretty=%B)"

echo ""
echo "✅ Update published!"
echo ""
echo "📱 How users get the update:"
echo "1. App checks for updates on launch"
echo "2. Downloads update in background"
echo "3. Applies update on next app restart"
echo ""
echo "⏱️  Updates typically take 1-2 minutes to propagate"
echo ""
echo "🔍 Check update status:"
echo "   eas update:list --branch preview"
echo ""
