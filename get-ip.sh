#!/bin/bash

echo "🔍 Finding your computer's IP address..."
echo ""

# Detect OS and get IP
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "OS: Linux"
    IP=$(hostname -I | awk '{print $1}')
    echo "Command: hostname -I"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "OS: macOS"
    IP=$(ipconfig getifaddr en0)
    echo "Command: ipconfig getifaddr en0"
else
    echo "OS: Windows/Other"
    echo "Run this command to find your IP:"
    echo "  ipconfig"
    echo ""
fi

if [ -n "$IP" ]; then
    echo ""
    echo "✅ Your IP Address: $IP"
    echo ""
    echo "📝 Update this in mobile/src/utils/constants.ts:"
    echo ""
    echo "export const API_URL = 'http://$IP:5000/api/v1';"
    echo ""
else
    echo ""
    echo "❌ Could not detect IP automatically"
    echo ""
    echo "Find your IP manually:"
    echo "  Linux:   hostname -I  or  ip addr"
    echo "  Mac:     ifconfig en0 | grep inet"
    echo "  Windows: ipconfig"
    echo ""
fi

echo "🔥 Firewall Configuration:"
echo ""
echo "Make sure these ports are open:"
echo "  - 5000  (Backend API)"
echo "  - 8081  (Expo Metro Bundler)"
echo "  - 19000-19001 (Expo Dev Server)"
echo ""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux Firewall Commands:"
    echo "  sudo ufw allow 5000"
    echo "  sudo ufw allow 8081"
    echo "  sudo ufw allow 19000:19001/tcp"
fi

echo ""
echo "✅ Next Steps:"
echo "1. Update API_URL in mobile/src/utils/constants.ts with your IP"
echo "2. Start backend: cd backend && npm run start:dev"
echo "3. Start mobile: cd mobile && npm start"
echo "4. Install Expo Go on your Android phone"
echo "5. Scan QR code with Expo Go app"
echo ""
