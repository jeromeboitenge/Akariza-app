#!/bin/bash

# Akariza Mobile - Publish Update Script
# This script helps you publish OTA updates to your mobile app

echo "🚀 Akariza Mobile - Publish Update"
echo "=================================="
echo ""

# Check if message is provided
if [ -z "$1" ]; then
    echo "❌ Error: Update message is required"
    echo ""
    echo "Usage: ./publish-update.sh \"Your update message\" [branch]"
    echo ""
    echo "Examples:"
    echo "  ./publish-update.sh \"Fixed login bug\" preview"
    echo "  ./publish-update.sh \"Added new features\" production"
    echo ""
    exit 1
fi

MESSAGE=$1
BRANCH=${2:-preview}

echo "📝 Update Message: $MESSAGE"
echo "🌿 Branch: $BRANCH"
echo ""

# Confirm
read -p "Continue with this update? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Update cancelled"
    exit 1
fi

echo ""
echo "📦 Publishing update..."
echo ""

# Publish update
eas update --branch $BRANCH --message "$MESSAGE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Update published successfully!"
    echo ""
    echo "📱 Users on the '$BRANCH' channel will receive this update"
    echo "   on their next app launch."
    echo ""
    echo "📊 View update status:"
    echo "   eas update:list --branch $BRANCH"
    echo ""
else
    echo ""
    echo "❌ Update failed. Please check the error above."
    echo ""
    exit 1
fi
