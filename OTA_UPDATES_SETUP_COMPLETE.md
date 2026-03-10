# OTA Updates Setup - Complete Guide

## Current Status
Your app is configured for OTA updates but updates are not being received. This guide will help you fix it.

## The Problem
`eas update --auto` requires that you have at least one EAS build. Without a build, EAS doesn't know which runtime version to target.

## Solution: Two Options

### Option 1: Create an EAS Build (Recommended for Production)
This is the proper way to set up OTA updates.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Create a build for Android
eas build --platform android --profile preview

# 4. Once the build is ready, you can publish updates
eas update --auto
```

### Option 2: Use Classic Expo Updates (Simpler, Works Now)
This uses Expo's classic update system without needing a build.

**Step 1: Update app.json**
```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

**Step 2: Publish updates locally**
```bash
export EXPO_TOKEN="your_token_here"
npx expo-cli@latest publish --release-channel production
```

**Step 3: Your app will receive updates on next load**

## Recommended Next Steps

1. **For immediate testing**: Use Option 2 (Classic Expo Updates)
   - Simpler setup
   - Works without builds
   - Good for development

2. **For production**: Use Option 1 (EAS Build + Updates)
   - More robust
   - Better for app store releases
   - Proper versioning

## Testing OTA Updates

Once set up, test with:

1. Make a code change
2. Publish the update (using the method above)
3. Close your app completely
4. Reopen the app
5. The app will check for updates and apply them automatically

## Troubleshooting

**App not receiving updates?**
- Check that `checkAutomatically: "ON_LOAD"` is set in app.json
- Make sure you're using the same EXPO_TOKEN
- Verify the update was published successfully
- Close and reopen the app (don't just background it)

**Workflow failing?**
- Check GitHub Actions logs for the actual error
- Verify EXPO_TOKEN is set in GitHub Secrets
- Make sure app.json is valid JSON

## Current Workflow

Your GitHub Actions workflow is set to:
- Trigger on push to `src/**` or `app.json`
- Run `eas update --auto --non-interactive`
- This requires an EAS build to exist

To make it work, either:
1. Create an EAS build first, OR
2. Switch to classic Expo updates (Option 2 above)
