#!/bin/bash

# Akariza Logo Preparation Script
# This script helps you prepare logo files for the app

echo "🎨 Akariza Logo Preparation"
echo "=========================="
echo ""

# Check if source logo exists
if [ ! -f "akariza-logo.png" ]; then
    echo "❌ Error: akariza-logo.png not found in current directory"
    echo ""
    echo "Please save your logo as 'akariza-logo.png' in this directory first."
    echo ""
    echo "Steps:"
    echo "1. Save the logo image you showed me"
    echo "2. Rename it to 'akariza-logo.png'"
    echo "3. Place it in the mobile app root directory"
    echo "4. Run this script again"
    exit 1
fi

echo "✅ Found akariza-logo.png"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not installed"
    echo ""
    echo "Option 1: Install ImageMagick"
    echo "  Linux: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo ""
    echo "Option 2: Use online tool"
    echo "  Visit: https://www.appicon.co/"
    echo "  Upload your logo and download all sizes"
    echo ""
    exit 1
fi

echo "✅ ImageMagick found"
echo ""
echo "🔄 Creating logo sizes..."
echo ""

# Create assets directory if it doesn't exist
mkdir -p assets

# Generate app icon (1024x1024)
echo "  Creating icon.png (1024x1024)..."
convert akariza-logo.png -resize 1024x1024 -background white -gravity center -extent 1024x1024 assets/icon.png

# Generate adaptive icon (512x512)
echo "  Creating adaptive-icon.png (512x512)..."
convert akariza-logo.png -resize 512x512 -background white -gravity center -extent 512x512 assets/adaptive-icon.png

# Generate favicon (48x48)
echo "  Creating favicon.png (48x48)..."
convert akariza-logo.png -resize 48x48 assets/favicon.png

# Generate splash screen (1284x2778)
echo "  Creating splash.png (1284x2778)..."
convert akariza-logo.png -resize 800x800 -background white -gravity center -extent 1284x2778 assets/splash.png

echo ""
echo "✅ Logo files created successfully!"
echo ""
echo "📁 Files created in assets/:"
ls -lh assets/*.png
echo ""
echo "🎯 Next steps:"
echo "1. Review the generated files in assets/ folder"
echo "2. Commit the changes:"
echo "   git add assets/"
echo "   git commit -m 'feat: Add Akariza logo assets'"
echo "   git push origin main"
echo "3. Rebuild the app:"
echo "   eas build --platform android --profile preview"
echo ""
echo "✨ Your logo will appear in the next build!"
