# 🚀 Akariza Mobile - OTA Updates Guide

## Overview

Your Akariza mobile app now supports **Over-The-Air (OTA) updates** using Expo Updates. This means you can push code changes and users will automatically receive updates without needing to download from app stores.

---

## ✨ What's Been Set Up

### 1. Automatic Update Checking
- App checks for updates on every launch
- Downloads and applies updates automatically
- Shows loading screen during update check
- Only works in production builds (not in development)

### 2. Update Service
- `src/services/updateService.ts` - Utility for managing updates
- Methods for checking, downloading, and applying updates
- User-friendly alerts and notifications

### 3. Configuration
- `app.json` - Update settings configured
- `eas.json` - Build channels set up (development, preview, production)
- `App.tsx` - Update logic integrated

---

## 📱 How It Works

### For Users
1. User opens the app
2. App checks for updates (shows "Checking for updates..." screen)
3. If update available:
   - Downloads automatically
   - Reloads app with new version
4. If no update:
   - App opens normally

### For Developers
1. Make code changes
2. Publish update to Expo
3. Users get updates automatically on next app launch

---

## 🛠️ Publishing Updates

### Step 1: Make Your Changes
```bash
cd mobile
# Make your code changes
# Test locally with: npm start
```

### Step 2: Publish Update
```bash
# For preview/testing
eas update --branch preview --message "Bug fixes and improvements"

# For production
eas update --branch production --message "New features added"
```

### Step 3: Users Get Updates
- Users will receive the update next time they open the app
- No app store submission needed!

---

## 🏗️ Building the App

### First Time Setup
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure project (if not done)
eas build:configure
```

### Build for Testing (Preview)
```bash
# Android APK
eas build --profile preview --platform android

# iOS (requires Apple Developer account)
eas build --profile preview --platform ios
```

### Build for Production
```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios

# Both platforms
eas build --profile production --platform all
```

---

## 📦 Update Channels

### Development
- For internal testing
- Frequent updates
- Not for end users

### Preview
- For beta testing
- Stable features
- Internal team and testers

### Production
- For end users
- Fully tested features
- Stable releases

---

## 🔄 Update Workflow

### Scenario 1: Bug Fix
```bash
# 1. Fix the bug in your code
# 2. Test locally
npm start

# 3. Publish to preview for testing
eas update --branch preview --message "Fixed login bug"

# 4. Test on preview build
# 5. If good, publish to production
eas update --branch production --message "Fixed login bug"
```

### Scenario 2: New Feature
```bash
# 1. Develop feature
# 2. Test locally
# 3. Publish to preview
eas update --branch preview --message "Added barcode scanner"

# 4. Beta test
# 5. Publish to production
eas update --branch production --message "Added barcode scanner"
```

### Scenario 3: Emergency Hotfix
```bash
# 1. Fix critical issue
# 2. Publish directly to production
eas update --branch production --message "Critical security fix"

# Users get update on next app launch
```

---

## 🎯 Update Strategies

### Automatic (Current Setup)
- App checks on launch
- Downloads and applies automatically
- Best for most cases

### Manual Check
Add a "Check for Updates" button in settings:
```typescript
import { UpdateService } from '../services/updateService';

// In your component
const handleCheckUpdates = async () => {
  await UpdateService.checkForUpdates(false);
};
```

### Background Updates
Check periodically while app is running:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    UpdateService.checkForUpdates(true); // Silent check
  }, 30 * 60 * 1000); // Every 30 minutes

  return () => clearInterval(interval);
}, []);
```

---

## 📊 Monitoring Updates

### Check Update Status
```bash
# View recent updates
eas update:list --branch production

# View specific update
eas update:view [update-id]
```

### Update Analytics
- Expo dashboard shows update adoption rates
- See how many users have each version
- Monitor update success/failure rates

---

## ⚠️ Important Notes

### What Can Be Updated via OTA
✅ JavaScript code changes
✅ React components
✅ Business logic
✅ API endpoints
✅ Styling
✅ Assets (images, fonts)

### What Requires New Build
❌ Native code changes
❌ New native dependencies
❌ Expo SDK version changes
❌ App permissions changes
❌ Build configuration changes

### Version Management
- Increment `version` in `app.json` for major releases
- Increment `versionCode` (Android) for each build
- Use `eas update` for code-only changes

---

## 🔧 Troubleshooting

### Update Not Appearing
1. Check you're using production build (not dev mode)
2. Verify update was published: `eas update:list`
3. Check app is using correct channel
4. Force close and reopen app

### Update Failed
1. Check internet connection
2. Check Expo status page
3. Review error logs
4. Try publishing update again

### Rollback Update
```bash
# Publish previous version
eas update --branch production --message "Rollback to previous version"
```

---

## 📱 Testing Updates

### Test Flow
1. Build preview APK: `eas build --profile preview --platform android`
2. Install on device
3. Make code change
4. Publish update: `eas update --branch preview --message "Test update"`
5. Close and reopen app
6. Verify update applied

---

## 🎉 Benefits of OTA Updates

### For Developers
- ✅ Fix bugs instantly
- ✅ Deploy features faster
- ✅ No app store review wait
- ✅ A/B testing capabilities
- ✅ Gradual rollouts

### For Users
- ✅ Always latest version
- ✅ No manual updates needed
- ✅ Smaller download sizes
- ✅ Faster bug fixes
- ✅ Seamless experience

---

## 📚 Additional Resources

- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Publishing Updates](https://docs.expo.dev/eas-update/getting-started/)

---

## 🚀 Quick Reference

```bash
# Publish update to preview
eas update --branch preview --message "Your message"

# Publish update to production
eas update --branch production --message "Your message"

# Build preview APK
eas build --profile preview --platform android

# Build production APK
eas build --profile production --platform android

# List updates
eas update:list --branch production

# View update details
eas update:view [update-id]
```

---

## ✅ Next Steps

1. **Build your first production APK**
   ```bash
   eas build --profile production --platform android
   ```

2. **Distribute to users**
   - Download APK from Expo dashboard
   - Share with users or upload to Play Store

3. **Make a change and publish update**
   ```bash
   # Make code changes
   eas update --branch production --message "First OTA update"
   ```

4. **Test the update**
   - Close and reopen app
   - Should see update applied

---

**Your app is now ready for automatic updates!** 🎉

Every time you push code changes and run `eas update`, your users will automatically receive the updates on their next app launch.
