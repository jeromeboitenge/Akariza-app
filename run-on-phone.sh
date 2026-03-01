#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     📱 AKARIZA - RUN ON YOUR ANDROID PHONE 📱             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Get computer's IP address
echo "🔍 Detecting your computer's IP address..."
echo ""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0)
else
    IP=$(ipconfig | grep -oP '(?<=IPv4 Address.*: )[\d.]+' | head -1)
fi

if [ -z "$IP" ]; then
    echo "❌ Could not detect IP address automatically"
    echo ""
    echo "Please find your IP manually:"
    echo "  - Linux: ip addr or ifconfig"
    echo "  - Mac: ifconfig en0 | grep inet"
    echo "  - Windows: ipconfig"
    echo ""
    read -p "Enter your computer's IP address: " IP
fi

echo "✅ Your computer's IP: $IP"
echo ""

# Update constants.ts with the IP
echo "📝 Updating API URL in src/utils/constants.ts..."
sed -i.bak "s|http://192.168.1.100:5000/api/v1|http://$IP:5000/api/v1|g" src/utils/constants.ts
rm -f src/utils/constants.ts.bak

echo "✅ API URL updated to: http://$IP:5000/api/v1"
echo ""

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s "http://localhost:5000/api/v1/health" > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is NOT running!"
    echo ""
    echo "Please start the backend first:"
    echo "  1. Open a new terminal"
    echo "  2. cd ../backend"
    echo "  3. npm run start:dev"
    echo ""
    read -p "Press Enter when backend is ready..."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              STEPS TO RUN ON YOUR PHONE                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Install Expo Go app on your Android phone:"
echo "    https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2️⃣  Make sure your phone and computer are on the SAME WiFi network"
echo ""
echo "3️⃣  Starting Expo development server..."
echo ""
echo "4️⃣  When QR code appears:"
echo "    - Open Expo Go app on your phone"
echo "    - Tap 'Scan QR code'"
echo "    - Scan the QR code from the terminal"
echo ""
echo "5️⃣  Login credentials:"
echo "    Email: admin@akariza.com"
echo "    Password: admin123"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Starting Expo..."
echo ""

# Start Expo
npm start
