# OTA Updates - Action Plan to Get Updates Working

## Current Status ✅

Your app is **properly configured** for OTA updates:
- ✅ app.json has updates enabled
- ✅ Check on load is enabled
- ✅ Update URL is configured
- ✅ GitHub Actions workflow exists
- ✅ You're logged in to Expo
- ✅ EAS CLI is installed

## Why You're Not Seeing Updates

The most likely reason: **EXPO_TOKEN secret is not added to GitHub**

## Action Plan (Follow These Steps)

### Step 1: Add EXPO_TOKEN to GitHub (2 minutes)

1. Go to https://expo.dev/settings/tokens
2. Click **Create Token**
3. Name: `GITHUB_OTA_UPDATE`
4. Copy the token (save it)

5. Go to your GitHub repository
6. Click **Settings**
7. Click **Secrets and variables** → **Actions**
8. Click **New repository secret**
9. Name: `EXPO_TOKEN`
10. Value: Paste your token
11. Click **Add secret**

### Step 2: Trigger the Workflow (1 minute)

Make a test change and push:

```bash
# Make a small change
echo "// OTA test" >> src/App.tsx

# Commit and push
git add src/App.tsx
git commit -m "test: trigger OTA update"
git push origin main
```

### Step 3: Verify Workflow Ran (2 minutes)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Look for "Publish OTA Update" workflow
4. It should show a green checkmark ✅

If it shows a red X ❌:
- Click the workflow
- Click **publish-update** job
- Read the error message
- Fix the issue

### Step 4: Test on Your Phone (3 minutes)

1. **Force close the app** (swipe up from recent apps)
2. **Reopen the app**
3. **Wait 5-10 seconds** for update check
4. **Look for a loading indicator** at the bottom
5. **Close and reopen the app** to apply the update

## Expected Behavior

When you push code:

```
You push → GitHub Actions runs → EAS publishes update → 
App checks for update on next open → Update downloads → 
Close and reopen app → Update applied ✅
```

## Verification

After following the steps above:

1. **Check GitHub Actions**
   ```
   Repository → Actions → "Publish OTA Update" should show ✅
   ```

2. **Check Expo Dashboard**
   ```bash
   eas update:list
   # Should show your recent update
   ```

3. **Check Your Phone**
   - Force close app
   - Reopen app
   - Wait 10 seconds
   - Should see loading indicator
   - Close and reopen to apply

## If It Still Doesn't Work

### Check 1: Verify EXPO_TOKEN

```bash
# Test token locally
eas update --branch production

# If it works, token is valid
# If it fails, regenerate token
```

### Check 2: Check Workflow Logs

1. Go to GitHub → Actions
2. Click the failed workflow
3. Click **publish-update** job
4. Expand **Publish OTA Update** step
5. Read the error message

### Check 3: Clear App Cache

On your phone:
1. Settings → Apps → Akariza
2. Storage → Clear Cache
3. Force close app
4. Reopen app
5. Wait 10 seconds

### Check 4: Rebuild App

If nothing works, rebuild the app:

```bash
# Build new APK
eas build --platform android --profile production

# Install on phone
# Then test OTA updates
```

## Quick Commands

```bash
# Check if token is valid
eas update --branch production

# List recent updates
eas update:list

# View update details
eas update:view <UPDATE_ID>

# Republish previous update
eas update:republish --branch production

# Check Expo login
eas whoami
```

## Files Created

- `.github/workflows/ota-update.yml` - GitHub Actions workflow
- `AUTOMATIC_OTA_UPDATES_GUIDE.md` - Setup guide
- `OTA_AUTO_UPDATE_SETUP.md` - Detailed guide
- `TROUBLESHOOT_OTA_UPDATES.md` - Troubleshooting guide
- `diagnose-ota.sh` - Diagnostic script
- `setup-ota-auto-update.sh` - Setup verification script

## Next Steps

1. ✅ Add EXPO_TOKEN to GitHub Secrets
2. ✅ Make a test commit and push
3. ✅ Check GitHub Actions
4. ✅ Force close and reopen app
5. ✅ Wait for update check
6. ✅ Verify update applied

## Support

- [Expo Updates Docs](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [Troubleshooting Guide](./TROUBLESHOOT_OTA_UPDATES.md)

---

**The most important step: Add EXPO_TOKEN to GitHub Secrets!**

Once you do that, your app will automatically receive updates when you push code.
