#!/bin/bash

echo "🚀 Setting up Akariza Mobile App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if backend is running
echo "🔍 Checking backend connection..."
BACKEND_URL="http://localhost:5000/api/v1/health"

if curl -s "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is not running. Please start the backend first:"
    echo "   cd ../backend && npm run start:dev"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 To start the app:"
echo "   npm start       # Start Expo dev server"
echo "   npm run ios     # Run on iOS simulator"
echo "   npm run android # Run on Android emulator"
echo ""
echo "🔑 Default login credentials:"
echo "   Email: admin@akariza.com"
echo "   Password: admin123"
echo ""
