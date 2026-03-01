#!/bin/bash

# Akariza Mobile - Quick Build Script

echo "🚀 Akariza Mobile Build Tool"
echo "=============================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

echo "Select build type:"
echo "1) Preview APK (for testing)"
echo "2) Production APK (for release)"
echo "3) Publish OTA Update"
echo "4) Check build status"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🔨 Building Preview APK..."
        eas build --platform android --profile preview
        ;;
    2)
        echo "🔨 Building Production APK..."
        eas build --platform android --profile production
        ;;
    3)
        read -p "Enter update message: " message
        echo "📤 Publishing OTA update..."
        eas update --branch production --message "$message"
        ;;
    4)
        echo "📊 Build Status:"
        eas build:list
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
