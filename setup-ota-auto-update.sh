#!/bin/bash

# Akariza Mobile App - Automatic OTA Update Setup Script
# This script helps you set up automatic OTA updates on GitHub push

set -e

echo "🚀 Akariza Mobile App - OTA Auto Update Setup"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run this script from the root of your project"
    exit 1
fi

# Check if app.json exists
if [ ! -f "app.json" ]; then
    echo "❌ Error: app.json not found"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check if workflow file exists
if [ -f ".github/workflows/ota-update.yml" ]; then
    echo "✅ Workflow file already exists"
else
    echo "⚠️  Workflow file not found"
fi

echo ""
echo "📋 Setup Instructions:"
echo "====================="
echo ""
echo "1️⃣  Create Expo Token:"
echo "   - Go to https://expo.dev/settings/tokens"
echo "   - Click 'Create Token'"
echo "   - Name it: GITHUB_OTA_UPDATE"
echo "   - Copy the token"
echo ""
echo "2️⃣  Add Token to GitHub:"
echo "   - Go to your GitHub repository"
echo "   - Settings → Secrets and variables → Actions"
echo "   - Click 'New repository secret'"
echo "   - Name: EXPO_TOKEN"
echo "   - Value: Paste your token"
echo "   - Click 'Add secret'"
echo ""
echo "3️⃣  Test It:"
echo "   - Make a code change"
echo "   - Commit: git commit -m 'test: trigger OTA update'"
echo "   - Push: git push origin main"
echo "   - Watch GitHub Actions tab"
echo "   - Open your app - should get update"
echo ""

# Ask if user wants to verify setup
read -p "Have you added the EXPO_TOKEN to GitHub Secrets? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🎉 Your app will now automatically receive updates when you push!"
    echo ""
    echo "Next steps:"
    echo "1. Make a code change"
    echo "2. Commit and push to main/master"
    echo "3. GitHub Actions will automatically publish the update"
    echo "4. Users will get the update on next app open"
    echo ""
    echo "📚 For more info, see: OTA_AUTO_UPDATE_SETUP.md"
else
    echo ""
    echo "⚠️  Please complete the setup steps above first"
    echo ""
    echo "Once you've added the EXPO_TOKEN to GitHub Secrets,"
    echo "run this script again to verify"
fi

echo ""
