#!/bin/bash

echo "Monitoring EAS build..."
echo "Build URL: https://expo.dev/accounts/boitenge/projects/akariza/builds/59d1de3e-c53c-4cbb-b46a-ca74bb8a7f47"
echo ""

while true; do
    STATUS=$(cd mobile && eas build:list --platform=android --limit=1 --non-interactive --json | jq -r '.[0].status')
    
    if [ "$STATUS" = "finished" ]; then
        echo "✅ Build completed successfully!"
        DOWNLOAD_URL=$(cd mobile && eas build:list --platform=android --limit=1 --non-interactive --json | jq -r '.[0].artifacts.buildUrl')
        echo ""
        echo "📱 Download your APK here:"
        echo "$DOWNLOAD_URL"
        echo ""
        echo "Install instructions:"
        echo "1. Download the APK on your phone"
        echo "2. Enable 'Install from unknown sources' in Settings"
        echo "3. Open the APK file to install"
        break
    elif [ "$STATUS" = "errored" ]; then
        echo "❌ Build failed!"
        echo "Check logs: https://expo.dev/accounts/boitenge/projects/akariza/builds/59d1de3e-c53c-4cbb-b46a-ca74bb8a7f47"
        break
    else
        echo "⏳ Build status: $STATUS - waiting..."
        sleep 30
    fi
done
