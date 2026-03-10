# Troubleshooting OTA Updates - Complete Guide

## Problem: App Not Receiving Updates

If your app isn't receiving updates, follow this checklist to diagnose the issue.

## Checklist

### 1. Verify GitHub Actions Workflow Ran

**Check if workflow executed:**

1. Go to your GitHub repository
2. Click **Actions** tab
3. Look for "Publish OTA Update" workflow
4. Check if it ran after your last push

**If workflow didn't run:**
- ❌ You didn't push to main/master branch
- ❌ You didn't change src/ or app.json
- ❌ GitHub Actions is disabled

**Fix:**
```bash
# Make a change in src/
echo "// test" >> src/App.tsx

# Commit and push
git add .
git commit -m "test: trigger OTA update"
git push origin main

# Wait 30 seconds, then check Actions tab
```

### 2. Verify EXPO_TOKEN Secret Exists

**Check if token is added:**

1. Go to your GitHub repository
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Look for `EXPO_TOKEN` in the list

**If EXPO_TOKEN is missing:**

1. Go to https://expo.dev/settings/tokens
2. Click **Create Token**
3. Name: `GITHUB_OTA_UPDATE`
4. Copy the token
5. Go back to GitHub → Settings → Secrets and variables → Actions
6. Click **New repository secret**
7. Name: `EXPO_TOKEN`
8. Value: Paste your token
9. Click **Add secret**

### 3. Check Workflow Logs

**View detailed logs:**

1. Go to GitHub → **Actions** tab
2. Click the latest "Publish OTA Update" workflow
3. Click **publish-update** job
4. Expand each step to see logs

**Common errors:**

```
Error: EXPO_TOKEN not found
→ Add EXPO_TOKEN to GitHub Secrets

Error: eas update failed
→ Check Expo token is valid
→ Check project ID in app.json

Error: npm install failed
→ Check package.json is valid
→ Check internet connection
```

### 4. Verify app.json Configuration

**Check OTA settings:**

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

**If settings are wrong:**
- ❌ `enabled` is false
- ❌ `checkAutomatically` is "NEVER"
- ❌ `url` is incorrect
- ❌ `runtimeVersion` is wrong

### 5. Test Manually

**Publish update manually to verify:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Publish update
eas update --branch production

# Check if successful
eas update:list
```

**If manual publish works:**
- ✅ Your setup is correct
- ✅ GitHub Actions token might be invalid
- ✅ Regenerate EXPO_TOKEN

**If manual publish fails:**
- ❌ Check Expo token validity
- ❌ Check project ID in app.json
- ❌ Check internet connection

### 6. Verify App Receives Updates

**On your phone:**

1. **Force close the app** (swipe up from recent apps)
2. **Reopen the app**
3. **Wait 5-10 seconds** for update check
4. **Look for loading indicator** (usually at bottom)
5. **Close and reopen app** to apply update

**If app doesn't check for updates:**
- ❌ App doesn't have internet connection
- ❌ `checkAutomatically` is set to "NEVER"
- ❌ App version doesn't match

### 7. Check Expo Dashboard

**View update status:**

```bash
# List recent updates
eas update:list

# View specific branch
eas update:list --branch production

# View update details
eas update:view <UPDATE_ID>
```

**If no updates appear:**
- ❌ Updates weren't published
- ❌ Wrong project ID
- ❌ Wrong branch

## Step-by-Step Troubleshooting

### Step 1: Verify Workflow Ran

```bash
# Make a test change
echo "// OTA test $(date)" >> src/App.tsx

# Commit and push
git add src/App.tsx
git commit -m "test: OTA update test"
git push origin main

# Wait 30 seconds
sleep 30

# Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### Step 2: Check Workflow Logs

If workflow ran but failed:

1. Click the failed workflow
2. Click **publish-update** job
3. Expand **Publish OTA Update** step
4. Read the error message

### Step 3: Verify Token

```bash
# Test token locally
eas login

# Try to publish
eas update --branch production

# If it works, token is valid
# If it fails, regenerate token
```

### Step 4: Check App Configuration

```bash
# View app.json
cat app.json | grep -A 10 "updates"

# Should show:
# "enabled": true
# "checkAutomatically": "ON_LOAD"
# "url": "https://u.expo.dev/..."
```

### Step 5: Test on Phone

1. **Close app completely**
2. **Reopen app**
3. **Wait for update check** (5-10 seconds)
4. **Look for loading indicator**
5. **Close and reopen** to apply

## Common Issues & Fixes

### Issue 1: Workflow Not Running

**Symptoms:**
- No workflow in Actions tab
- No "Publish OTA Update" job

**Causes:**
- Pushed to wrong branch (not main/master)
- Didn't change src/ or app.json
- GitHub Actions disabled

**Fix:**
```bash
# Make sure you're on main/master
git branch

# Make a change in src/
echo "// test" >> src/App.tsx

# Commit and push
git add .
git commit -m "test: trigger workflow"
git push origin main

# Check Actions tab
```

### Issue 2: Workflow Failed

**Symptoms:**
- Red X in Actions tab
- Workflow shows "failed"

**Causes:**
- EXPO_TOKEN not set
- EXPO_TOKEN is invalid
- npm install failed
- eas update failed

**Fix:**
1. Click failed workflow
2. Read error message
3. Fix the issue
4. Push again

### Issue 3: App Not Checking for Updates

**Symptoms:**
- App opens but no update check
- No loading indicator
- App doesn't update

**Causes:**
- `checkAutomatically` is "NEVER"
- App doesn't have internet
- App version mismatch
- Update not published

**Fix:**
```bash
# Check app.json
cat app.json | grep checkAutomatically

# Should be "ON_LOAD"
# If not, change it and rebuild

# Or test manually
eas update --branch production

# Then open app and check
```

### Issue 4: Update Published But Not Received

**Symptoms:**
- Workflow succeeded
- eas update:list shows update
- App doesn't get it

**Causes:**
- App doesn't have internet
- App version mismatch
- Runtime version mismatch
- Cache issue

**Fix:**
```bash
# On phone:
# 1. Force close app
# 2. Clear app cache (Settings → Apps → Akariza → Storage → Clear Cache)
# 3. Reopen app
# 4. Wait 10 seconds
# 5. Check for update

# Or reinstall app
```

## Advanced Debugging

### Enable Update Logging

Add to your app code:

```typescript
import * as Updates from 'expo-updates';

export default function App() {
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        console.log('Update available:', update.isAvailable);
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error('Error checking for updates:', e);
      }
    };

    checkForUpdates();
  }, []);

  return (
    // Your app
  );
}
```

### Check Update Manifest

```bash
# Get your project ID from app.json
PROJECT_ID="4556b8d7-8b86-4c92-9e05-dc82bba1cebf"

# View manifest
curl https://u.expo.dev/$PROJECT_ID/manifest

# Should return JSON with update info
```

### View Expo Logs

```bash
# Install expo-cli
npm install -g expo-cli

# View logs
expo logs --clear

# Then open app on phone
# Logs will appear in terminal
```

## Verification Checklist

- [ ] GitHub Actions workflow exists (`.github/workflows/ota-update.yml`)
- [ ] EXPO_TOKEN secret added to GitHub
- [ ] Workflow ran after last push
- [ ] Workflow succeeded (green checkmark)
- [ ] `eas update:list` shows recent update
- [ ] app.json has `"enabled": true`
- [ ] app.json has `"checkAutomatically": "ON_LOAD"`
- [ ] App has internet connection
- [ ] App version matches in app.json
- [ ] Phone has enough storage
- [ ] App cache cleared

## Quick Fixes

### Fix 1: Regenerate EXPO_TOKEN

```bash
# 1. Go to https://expo.dev/settings/tokens
# 2. Delete old token
# 3. Create new token
# 4. Copy token
# 5. Go to GitHub → Settings → Secrets
# 6. Update EXPO_TOKEN with new value
# 7. Push a change to trigger workflow
```

### Fix 2: Force Update Check

```bash
# On phone:
# 1. Force close app (swipe up from recent)
# 2. Clear app cache (Settings → Apps → Akariza → Storage → Clear Cache)
# 3. Reopen app
# 4. Wait 10 seconds
# 5. Should check for update
```

### Fix 3: Manual Publish

```bash
# If workflow fails, publish manually
eas update --branch production

# Then test on phone
```

### Fix 4: Rebuild App

If nothing works, rebuild the app:

```bash
# Build new APK
eas build --platform android --profile production

# Install on phone
# Then test OTA updates
```

## Support

- [Expo Updates Docs](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Expo Community](https://forums.expo.dev/)

## Next Steps

1. ✅ Check GitHub Actions workflow ran
2. ✅ Verify EXPO_TOKEN is set
3. ✅ Check workflow logs for errors
4. ✅ Test manual publish: `eas update --branch production`
5. ✅ Force close and reopen app on phone
6. ✅ Wait 10 seconds for update check
7. ✅ Check for loading indicator

---

**Still not working?** Follow the checklist above step-by-step. Most issues are:
1. EXPO_TOKEN not set
2. Workflow didn't run
3. App cache needs clearing
4. App doesn't have internet
