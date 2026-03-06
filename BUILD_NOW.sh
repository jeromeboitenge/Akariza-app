#!/bin/bash

# Akariza Mobile - Build Script
# This script guides you through building the app

echo "📱 Akariza Mobile - Build Process"
echo "=================================="
echo ""

# Check if logged in
if ! eas whoami &> /dev/null; then
    echo "❌ You're not logged in to Expo"
    echo ""
    echo "Please login first:"
    echo "  eas login"
    echo ""
    echo "Don't have an account? Sign up at: https://expo.dev/signup"
    echo ""
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Confirm build
echo "This will build a production APK for Android."
echo "The build will take 10-20 minutes."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Build cancelled"
    exit 1
fi

echo ""
echo "🏗️  Starting build..."
echo ""
echo "⏳ This will take 10-20 minutes. You can close this terminal."
echo "   Check build status at: https://expo.dev"
echo ""

# Start build
eas build --profile production --platform android

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build started successfully!"
    echo ""
    echo "📊 Check build status:"
    echo "   eas build:list"
    echo ""
    echo "📥 Once complete, download the APK from:"
    echo "   https://expo.dev/accounts/$(eas whoami)/projects/akariza/builds"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check the error above."
    echo ""
    exit 1
fi
