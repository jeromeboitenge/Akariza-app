# Build Instructions for Akariza Mobile App

## Fixed Issue
The build was failing due to a compatibility issue between `expo-updates@55.0.12` and React Native 0.81.5. 

**Solution Applied:**
- Created a patch using `patch-package` that comments out the incompatible `getDelayLoadAppHandler` method
- The app will still receive updates, just without the delay-load optimization
- Patch is automatically applied after `npm install` via the `postinstall` script

## Prerequisites
1. EAS CLI installed: `npm install -g eas-cli`
2. Expo account (sign up at expo.dev)
3. EAS account configured: `eas login`

## Build for Android (APK for direct installation)

### Option 1: Build APK (Recommended for testing)
```bash
# Build APK that you can install directly on your phone
eas build --platform android --profile preview
```

### Option 2: Build AAB (For Google Play Store)
```bash
# Build Android App Bundle for Play Store
eas build --platform android --profile production
```

## Build Process
1. EAS will upload your code to Expo's servers
2. Build will take 10-20 minutes
3. You'll get a download link when complete
4. Download the APK to your phone and install it

## Install on Phone
1. Download the APK from the link EAS provides
2. On your Android phone, go to Settings > Security
3. Enable "Install from Unknown Sources" or "Install Unknown Apps"
4. Open the downloaded APK file
5. Tap "Install"

## Monitor Build Status
```bash
# Check build status
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

## Local Development
```bash
# Start development server
npm start

# Run on Android device/emulator
npm run android
```

## Troubleshooting

### If build fails again:
1. Clear caches:
```bash
rm -rf node_modules
rm -rf android/app/build
rm -rf .expo
npm install
```

2. Verify patch is applied:
```bash
cat patches/expo-updates+55.0.12.patch
```

3. Check EAS configuration:
```bash
cat eas.json
```

### If app crashes on phone:
1. Check logs: `adb logcat` (if phone connected via USB)
2. Verify API_URL in .env file is accessible from phone
3. Make sure backend server is running and accessible

## Environment Variables
Make sure your `.env` file has:
```
API_URL=https://akariza-backend.onrender.com/api/v1
APP_NAME=Akariza
APP_VERSION=1.0.0
```

## Next Steps After Successful Build
1. Test all features on your phone
2. Fix any issues found during testing
3. Build production version for Play Store
4. Submit to Google Play Store (if needed)
