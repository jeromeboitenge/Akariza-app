#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║          🎉 AKARIZA MOBILE APP - QUICK START 🎉           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile directory"
    echo "   cd mobile && ./quickstart.sh"
    exit 1
fi

echo "📋 Pre-flight Checklist:"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

echo ""
echo "🔧 Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

echo "🔍 Step 2: Checking backend connection..."
BACKEND_URL="http://localhost:5000/api/v1/health"

if curl -s "$BACKEND_URL" > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:5000"
else
    echo "⚠️  Backend is not running!"
    echo ""
    echo "   Please start the backend first:"
    echo "   1. Open a new terminal"
    echo "   2. cd ../backend"
    echo "   3. npm run start:dev"
    echo ""
    read -p "   Press Enter when backend is ready..."
fi

echo ""
echo "📱 Step 3: Starting Expo development server..."
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    IMPORTANT NOTES                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 API Configuration:"
echo "   - iOS Simulator: http://localhost:5000/api/v1"
echo "   - Android Emulator: http://10.0.2.2:5000/api/v1"
echo "   - Physical Device: http://YOUR_COMPUTER_IP:5000/api/v1"
echo ""
echo "🔑 Demo Login Credentials:"
echo "   Email: admin@akariza.com"
echo "   Password: admin123"
echo ""
echo "🎯 Available Commands:"
echo "   - Press 'i' for iOS simulator"
echo "   - Press 'a' for Android emulator"
echo "   - Scan QR code with Expo Go app"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Main documentation"
echo "   - IMPLEMENTATION_COMPLETE.md - Implementation guide"
echo "   - COMPLETE_SUMMARY.md - Feature summary"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Start Expo
npm start
