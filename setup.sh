#!/bin/bash

echo "🚀 Starting Akariza Mobile App Setup..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📱 Mobile App Ready!"
echo ""
echo "To start development:"
echo "  npm start          - Start Expo dev server"
echo "  npm run android    - Run on Android"
echo "  npm run ios        - Run on iOS"
echo "  npm run web        - Run on web browser"
echo ""
echo "📝 Demo Credentials:"
echo "  Boss:    boss@store.com / boss123"
echo "  Manager: manager@store.com / manager123"
echo "  Cashier: cashier@store.com / cashier123"
echo ""
echo "🔧 API Configuration:"
echo "  Edit src/utils/constants.ts to change API URL"
echo "  Current: http://localhost:5000/api/v1"
echo ""
echo "📚 Documentation: MOBILE_APP_GUIDE.md"
echo ""
