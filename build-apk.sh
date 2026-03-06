#!/bin/bash

# Build APK for Akariza Mobile App
# This script builds an APK that you can install directly on your Android phone

echo "🚀 Starting Akariza Mobile App Build..."
echo ""
echo "This will:"
echo "1. Apply the expo-updates patch"
echo "2. Build an APK using EAS"
echo "3. Provide a download link when complete"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null
then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if logged in to EAS
echo "📝 Checking EAS login status..."
if ! eas whoami &> /dev/null
then
    echo "❌ Not logged in to EAS. Please login:"
    eas login
fi

# Apply patches
echo "🔧 Applying patches..."
npm run postinstall

# Start build
echo ""
echo "🏗️  Starting build process..."
echo "This will take 10-20 minutes. You can close this terminal."
echo ""

eas build --platform android --profile preview

echo ""
echo "✅ Build submitted!"
echo ""
echo "📱 To install on your phone:"
echo "1. Download the APK from the link above"
echo "2. Enable 'Install from Unknown Sources' in phone settings"
echo "3. Open the APK file and tap Install"
echo ""
echo "📊 Check build status: eas build:list"
