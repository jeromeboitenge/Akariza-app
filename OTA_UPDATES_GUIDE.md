# 📲 Over-The-Air (OTA) Updates Guide

## Why Your App Doesn't Update Automatically

When you push code to GitHub, your installed app doesn't see the changes because:

1. **Standalone APK**: Your app is a compiled APK, not running in Expo Go
2. **No Auto-Sync**: GitHub and your phone aren't connected
3. **Needs Publishing**: Updates must be published through Expo's update service

## ✅ Solution: OTA Updates

OTA (Over-The-Air) updates let you push JavaScript/TypeScript changes to installed apps **without rebuilding**.

### What Can Be Updated OTA:
- ✅ JavaScript/TypeScript code
- ✅ React components
- ✅ API calls and logic
- ✅ Styles and layouts
- ✅ App screens and navigation
- ✅ Business logic

### What Requires Rebuild:
- ❌ Native code changes (Android/iOS)
- ❌ New native dependencies
- ❌ app.json configuration changes
- ❌ Asset changes (icons, splash screens)
- ❌ Permissions changes

## 🚀 How to Publish Updates

### Method 1: Use the Script (Easiest)

```bash
# After making code changes and pushing to GitHub
./publish-update.sh
```

### Method 2: Manual Command

```bash
# Publish to preview channel (matches your build profile)
eas update --branch preview --message "Your update description"

# Or publish to production
eas update --branch production --message "Your update description"
```

## 📋 Complete Workflow

### 1. Make Code Changes
```bash
# Edit your code
vim src/screens/LoginScreen.tsx

# Test locally
npm start
```

### 2. Commit and Push
```bash
git add .
git commit -m "feat: Update login screen"
git push origin main
```

### 3. Publish Update
```bash
./publish-update.sh
```

### 4. Users Get Update
- App checks for updates on launch
- Downloads update in background
- Applies on next app restart

## ⚙️ Configuration

I've already configured OTA updates in `app.json`:

```json
{
  "updates": {
    "enabled": true,
    "checkAutomatically": "ON_LOAD",
    "fallbackToCacheTimeout": 0,
    "url": "https://u.expo.dev/[your-project-id]"
  },
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
```

### Update Channels

Your app has different channels matching build profiles:

- **preview**: For testing (matches preview build)
- **production**: For live users (matches production build)

## 🔄 Update Flow Diagram

```
Developer                    Expo Servers              User's Phone
    |                             |                          |
    | 1. Make code changes        |                          |
    |----------------------------->|                          |
    |                             |                          |
    | 2. Publish update           |                          |
    |----------------------------->|                          |
    |                             |                          |
    |                             | 3. App checks on launch  |
    |                             |<-------------------------|
    |                             |                          |
    |                             | 4. Download update       |
    |                             |------------------------->|
    |                             |                          |
    |                             |    5. Apply on restart   |
    |                             |                          |
```

## 📱 Testing Updates

### On Your Phone:

1. **Install the app** (if not already installed)
2. **Close the app completely**
3. **Publish an update** using the script
4. **Wait 1-2 minutes** for propagation
5. **Open the app** - it will check for updates
6. **Restart the app** - update will be applied

### Check Update Status:

```bash
# List all updates
eas update:list --branch preview

# View specific update
eas update:view [update-id]
```

## 🎯 Best Practices

### 1. Always Test Locally First
```bash
npm start
# Test in Expo Go or emulator
```

### 2. Use Descriptive Messages
```bash
eas update --branch preview --message "Fix: Resolve login button issue"
```

### 3. Version Your Updates
Update the version in `app.json` for major changes:
```json
{
  "version": "1.0.2"  // Increment this
}
```

### 4. Monitor Updates
```bash
# Check if update was successful
eas update:list --branch preview
```

## 🔧 Troubleshooting

### Update Not Showing?

1. **Check update was published:**
   ```bash
   eas update:list --branch preview
   ```

2. **Verify app is checking for updates:**
   - Close app completely
   - Wait 2 minutes
   - Reopen app

3. **Check runtime version matches:**
   - App's runtime version must match update's runtime version
   - Both use `appVersion` policy

4. **Clear app data** (last resort):
   - Go to phone Settings > Apps > Akariza
   - Clear data
   - Reopen app

### "No updates available"?

- Wait 1-2 minutes after publishing
- Ensure you're on the correct channel (preview vs production)
- Check that app was built with updates enabled

### Update Failed?

- Check error logs: `eas update:list --branch preview`
- Verify no syntax errors in code
- Ensure all dependencies are installed

## 📊 Update Strategies

### Development Workflow:
```bash
# Make changes
git add .
git commit -m "feat: Add new feature"
git push

# Publish to preview
eas update --branch preview --message "Testing new feature"
```

### Production Workflow:
```bash
# After testing in preview
eas update --branch production --message "Release: New feature"
```

## 🚨 When to Rebuild vs Update

### Use OTA Update When:
- Fixing bugs in JavaScript code
- Updating UI components
- Changing API endpoints
- Modifying business logic
- Updating styles

### Rebuild When:
- Adding new native modules
- Changing app icon or splash screen
- Updating permissions
- Modifying app.json significantly
- Upgrading Expo SDK

## 📈 Monitoring Updates

### View Update Analytics:
```bash
# List all updates
eas update:list

# View specific branch
eas update:list --branch preview

# Check update details
eas update:view [update-id]
```

### Update Metrics:
- Number of downloads
- Success rate
- Rollback if needed

## 🎉 Quick Reference

```bash
# Publish update
./publish-update.sh

# Or manually
eas update --branch preview --message "Your message"

# Check updates
eas update:list --branch preview

# View specific update
eas update:view [update-id]

# Rollback (if needed)
eas update:rollback --branch preview
```

## ✅ Summary

**Before OTA Setup:**
- Push code → No changes on phone
- Need to rebuild APK every time
- Users must reinstall app

**After OTA Setup:**
- Push code → Publish update → Users get it automatically
- No rebuild needed for code changes
- Updates in 1-2 minutes

**Next Steps:**
1. ✅ OTA updates are now configured
2. Make a code change
3. Run `./publish-update.sh`
4. Test on your phone
5. See the update! 🎉

---

**Pro Tip:** For quick iterations during development, use OTA updates. For major releases with native changes, rebuild the APK.
