# Akariza Mobile - Build & Deploy Guide

## 🚀 Build APK for Direct Installation

### Prerequisites
```bash
npm install -g eas-cli
```

### Step 1: Login to Expo
```bash
cd mobile
eas login
```

### Step 2: Configure Project
```bash
eas build:configure
```

### Step 3: Build APK
```bash
# For production APK
eas build --platform android --profile production

# For preview/testing APK
eas build --platform android --profile preview
```

The build will take 10-15 minutes. Once complete, you'll get a download link for the APK.

## 📱 Install APK on Phone

1. Download the APK from the link provided by EAS
2. Transfer to your phone or download directly
3. Enable "Install from Unknown Sources" in Android settings
4. Install the APK

## 🔄 Over-The-Air (OTA) Updates

### Setup OTA Updates

1. **Install expo-updates package** (already included)
```bash
npx expo install expo-updates
```

2. **Publish Update**
```bash
eas update --branch production --message "Your update message"
```

### How OTA Works

- When you publish an update, users will automatically receive it
- Updates download in the background
- Applied on next app restart
- No need to reinstall APK
- Works for JS/React code changes only (not native code)

### Publishing Updates After Code Changes

```bash
# After making changes to your code
cd mobile
git add -A
git commit -m "Your changes"
git push

# Publish OTA update
eas update --branch production --message "Bug fixes and improvements"
```

## 📋 Build Profiles

### Preview (Testing)
- Builds APK for internal testing
- Faster build times
- Use for development testing

```bash
eas build --platform android --profile preview
```

### Production (Release)
- Optimized production build
- Smaller APK size
- Use for distribution

```bash
eas build --platform android --profile production
```

## 🔧 Update Version

When making major changes, update version in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

Then rebuild:
```bash
eas build --platform android --profile production
```

## 📊 Monitor Updates

Check update status:
```bash
eas update:list --branch production
```

## 🎯 Quick Commands

```bash
# Build production APK
eas build -p android --profile production

# Publish OTA update
eas update --branch production -m "Update message"

# Check build status
eas build:list

# View update history
eas update:list
```

## 💡 Tips

1. **For code changes only**: Use OTA updates (faster, no reinstall)
2. **For native changes**: Rebuild APK (dependencies, permissions, etc.)
3. **Test first**: Use preview profile before production
4. **Version control**: Always commit before publishing updates

## 🔐 Environment Variables

For sensitive data, use EAS Secrets:
```bash
eas secret:create --scope project --name API_URL --value "https://your-api.com"
```

## 📱 Distribution

Share the APK link with users:
- Via email
- WhatsApp/Telegram
- Cloud storage (Google Drive, Dropbox)
- Your own server

Users install once, then receive automatic updates!
