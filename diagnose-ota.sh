#!/bin/bash

# Akariza Mobile App - OTA Updates Diagnostic Script
# This script checks if OTA updates are properly configured

echo "🔍 Akariza OTA Updates Diagnostic"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: app.json exists
echo "1️⃣  Checking app.json..."
if [ -f "app.json" ]; then
    echo -e "${GREEN}✅ app.json found${NC}"
    
    # Check updates enabled
    if grep -q '"enabled": true' app.json; then
        echo -e "${GREEN}✅ Updates enabled${NC}"
    else
        echo -e "${RED}❌ Updates not enabled${NC}"
    fi
    
    # Check checkAutomatically
    if grep -q '"checkAutomatically": "ON_LOAD"' app.json; then
        echo -e "${GREEN}✅ Check on load enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Check on load might not be set to ON_LOAD${NC}"
    fi
    
    # Check URL
    if grep -q '"url": "https://u.expo.dev/' app.json; then
        echo -e "${GREEN}✅ Update URL configured${NC}"
    else
        echo -e "${RED}❌ Update URL not configured${NC}"
    fi
else
    echo -e "${RED}❌ app.json not found${NC}"
fi

echo ""

# Check 2: Workflow file exists
echo "2️⃣  Checking GitHub Actions workflow..."
if [ -f ".github/workflows/ota-update.yml" ]; then
    echo -e "${GREEN}✅ Workflow file exists${NC}"
else
    echo -e "${RED}❌ Workflow file not found${NC}"
fi

echo ""

# Check 3: Git status
echo "3️⃣  Checking git status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository found${NC}"
    
    # Check current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
        echo -e "${GREEN}✅ On $BRANCH branch${NC}"
    else
        echo -e "${YELLOW}⚠️  On $BRANCH branch (workflow only runs on main/master)${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi

echo ""

# Check 4: EAS CLI installed
echo "4️⃣  Checking EAS CLI..."
if command -v eas &> /dev/null; then
    echo -e "${GREEN}✅ EAS CLI installed${NC}"
    eas --version
else
    echo -e "${YELLOW}⚠️  EAS CLI not installed${NC}"
    echo "   Install with: npm install -g eas-cli"
fi

echo ""

# Check 5: Node.js
echo "5️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js installed${NC}"
    node --version
else
    echo -e "${RED}❌ Node.js not installed${NC}"
fi

echo ""

# Check 6: npm
echo "6️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm installed${NC}"
    npm --version
else
    echo -e "${RED}❌ npm not installed${NC}"
fi

echo ""

# Check 7: Recent commits
echo "7️⃣  Checking recent commits..."
if [ -d ".git" ]; then
    echo "Recent commits:"
    git log --oneline -5
else
    echo -e "${YELLOW}⚠️  Not a git repository${NC}"
fi

echo ""

# Summary
echo "📋 Summary"
echo "=========="
echo ""
echo "To enable OTA updates:"
echo ""
echo "1. Create Expo token:"
echo "   https://expo.dev/settings/tokens"
echo ""
echo "2. Add to GitHub Secrets:"
echo "   Settings → Secrets and variables → Actions"
echo "   Name: EXPO_TOKEN"
echo "   Value: Your token"
echo ""
echo "3. Make a change and push:"
echo "   git add ."
echo "   git commit -m 'test: trigger OTA update'"
echo "   git push origin main"
echo ""
echo "4. Check GitHub Actions:"
echo "   https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
echo ""
echo "5. Open app on phone:"
echo "   Force close and reopen"
echo "   Wait 10 seconds for update check"
echo ""

# Check if EXPO_TOKEN is set locally
echo "🔐 Checking local Expo login..."
if eas whoami &> /dev/null; then
    echo -e "${GREEN}✅ Logged in to Expo${NC}"
    eas whoami
else
    echo -e "${YELLOW}⚠️  Not logged in to Expo${NC}"
    echo "   Run: eas login"
fi

echo ""
echo "✅ Diagnostic complete!"
echo ""
echo "For more help, see: TROUBLESHOOT_OTA_UPDATES.md"
