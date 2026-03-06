#!/bin/bash

# Akariza - Start Build Script
# This script will guide you through building the app

echo "📱 Akariza - Build Your App"
echo "============================"
echo ""

# Check if logged in
echo "Checking login status..."
if ! eas whoami &> /dev/null; then
    echo ""
    echo "❌ Not logged in to Expo"
    echo ""
    echo "Please login now:"
    echo ""
    eas login
    echo ""
    
    # Check again after login
    if ! eas whoami &> /dev/null; then
        echo "❌ Login failed. Please try again."
        exit 1
    fi
fi

echo ""
echo "✅ Logged in as: $(eas whoami)"
echo ""
echo "🏗️  Starting production build for Android..."
echo ""
echo "⏳ This will take 10-20 minutes"
echo "   You can close this terminal and check status at:"
echo "   https://expo.dev/accounts/$(eas whoami)/projects/akariza/builds"
echo ""

# Start the build
eas build --profile production --platform android

echo ""
echo "✅ Build started!"
echo ""
echo "📊 Check build status:"
echo "   https://expo.dev/accounts/$(eas whoami)/projects/akariza/builds"
echo ""
echo "📥 Once complete, download the APK from the link above"
echo ""
