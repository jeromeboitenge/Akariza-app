#!/bin/bash

# Akariza Mobile - Build App Script
# This script helps you build the mobile app

echo "🏗️  Akariza Mobile - Build App"
echo "=============================="
echo ""

# Select platform
echo "Select platform:"
echo "1) Android"
echo "2) iOS"
echo "3) Both"
read -p "Enter choice (1-3): " platform_choice

case $platform_choice in
    1) PLATFORM="android" ;;
    2) PLATFORM="ios" ;;
    3) PLATFORM="all" ;;
    *) echo "❌ Invalid choice"; exit 1 ;;
esac

# Select profile
echo ""
echo "Select build profile:"
echo "1) Preview (for testing)"
echo "2) Production (for release)"
read -p "Enter choice (1-2): " profile_choice

case $profile_choice in
    1) PROFILE="preview" ;;
    2) PROFILE="production" ;;
    *) echo "❌ Invalid choice"; exit 1 ;;
esac

echo ""
echo "📋 Build Configuration:"
echo "   Platform: $PLATFORM"
echo "   Profile: $PROFILE"
echo ""

# Confirm
read -p "Start build? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Build cancelled"
    exit 1
fi

echo ""
echo "🏗️  Starting build..."
echo ""
echo "⏳ This may take 10-20 minutes..."
echo ""

# Start build
eas build --profile $PROFILE --platform $PLATFORM

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "📱 Download your build from:"
    echo "   https://expo.dev/accounts/[your-account]/projects/akariza/builds"
    echo ""
    echo "📦 Next steps:"
    if [ "$PROFILE" = "preview" ]; then
        echo "   1. Download and install on test device"
        echo "   2. Test all features"
        echo "   3. If good, build production version"
    else
        echo "   1. Download the build"
        echo "   2. Test on device"
        echo "   3. Upload to Play Store / App Store"
    fi
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check the error above."
    echo ""
    exit 1
fi
