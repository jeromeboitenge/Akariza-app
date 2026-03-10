# Verify OTA Update - Test Guide

## What Just Happened

✅ **Code Change Made**: Added "App Updated!" banner to dashboard
✅ **Committed**: `feat: add OTA update success banner to dashboard`
✅ **Pushed**: Code pushed to GitHub main branch
✅ **Workflow Triggered**: GitHub Actions automatically published OTA update

## Now Test It on Your Phone

### Step 1: Check GitHub Actions (Verify Workflow Ran)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Look for "Publish OTA Update" workflow
4. Should show **green checkmark ✅** (success)

**If you see red X ❌:**
- Click the workflow
- Click **publish-update** job
- Read the error message
- Check EXPO_TOKEN is correct

### Step 2: Prepare Your Phone

1. **Make sure app is installed** on your phone
2. **Make sure phone has internet** (WiFi or mobile data)
3. **Have the app open** (or ready to open)

### Step 3: Force Update Check

1. **Force close the app** completely
   - Swipe up from recent apps
   - Or go to Settings → Apps → Akariza → Force Stop

2. **Reopen the app**
   - Tap the app icon
   - Wait for it to load

3. **Wait 5-10 seconds** for update check
   - Look for a **loading indicator** at the bottom
   - App is checking for updates

4. **If update found:**
   - App will download in background
   - You'll see a loading bar
   - Wait for it to complete

5. **Close and reopen the app**
   - Close the app completely
   - Reopen it
   - Update will be applied

### Step 4: Verify Update Applied

**Look for the green banner that says:**
```
✓ App Updated!
You're running the latest version with new features and improvements.
```

**If you see this banner:**
✅ **OTA Update Successful!**

---

## What to Expect

### Timeline

```
You push code (just now)
         ↓
GitHub Actions runs (1-2 minutes)
         ↓
EAS publishes update (30 seconds)
         ↓
Update available on Expo servers (instant)
         ↓
You open app on phone
         ↓
App checks for updates (5-10 seconds)
         ↓
Update downloads (depends on size)
         ↓
Close and reopen app
         ↓
Update applied ✅
         ↓
See "App Updated!" banner
```

### Update Size

- **Typical size**: 1-5 MB
- **Download time**: 5-30 seconds (depends on connection)
- **Installation time**: Instant (on next app open)

---

## Troubleshooting

### Issue 1: No Loading Indicator

**Symptoms:**
- App opens but no loading indicator
- No update check happening

**Causes:**
- App doesn't have internet
- Update already applied
- Workflow didn't run

**Fix:**
1. Check internet connection
2. Go to GitHub Actions tab
3. Verify workflow shows green checkmark
4. Try force closing and reopening app again

### Issue 2: Workflow Failed

**Symptoms:**
- Red X in GitHub Actions
- Workflow shows "failed"

**Causes:**
- EXPO_TOKEN not set correctly
- EXPO_TOKEN expired
- npm install failed

**Fix:**
1. Click failed workflow
2. Click **publish-update** job
3. Read error message
4. Regenerate EXPO_TOKEN if needed

### Issue 3: Update Downloaded But Not Applied

**Symptoms:**
- Loading indicator appeared
- But banner doesn't show after reopening

**Causes:**
- App cache issue
- Update not fully downloaded
- App version mismatch

**Fix:**
1. Force close app
2. Clear app cache (Settings → Apps → Akariza → Storage → Clear Cache)
3. Reopen app
4. Wait 10 seconds
5. Close and reopen again

### Issue 4: Still Don't See Banner

**Symptoms:**
- App opens but no "App Updated!" banner

**Causes:**
- Update not published yet
- App cache needs clearing
- Workflow still running

**Fix:**
1. Wait 2-3 minutes for workflow to complete
2. Clear app cache
3. Force close and reopen app
4. Wait 10 seconds for update check

---

## Verify Workflow Completed

### Check GitHub Actions

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Look for "Publish OTA Update" workflow
3. Should show:
   - ✅ Green checkmark (success)
   - Timestamp of when it ran
   - "publish-update" job completed

### Check Expo Dashboard

```bash
# List recent updates
eas update:list

# Should show your update with:
# - Branch: production
# - Status: published
# - Time: just now
```

---

## Success Indicators

✅ **Workflow succeeded** (green checkmark in GitHub Actions)
✅ **Update published** (shows in `eas update:list`)
✅ **App checks for update** (loading indicator appears)
✅ **Update downloads** (loading bar shows)
✅ **Banner appears** ("App Updated!" message)

---

## Next Steps

### If Update Works ✅

1. **Celebrate!** 🎉 OTA updates are working!
2. **Make more changes** and push them
3. **App will automatically receive updates** on next open
4. **No manual `eas update` needed** anymore

### If Update Doesn't Work ❌

1. **Check GitHub Actions** - Did workflow run?
2. **Check EXPO_TOKEN** - Is it set correctly?
3. **Check app cache** - Clear it and try again
4. **Check internet** - Does phone have connection?
5. **Read error logs** - What does GitHub Actions say?

---

## Quick Reference

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Push code | GitHub Actions triggered |
| 2 | Wait 1-2 min | Workflow completes |
| 3 | Check Actions | Green checkmark ✅ |
| 4 | Open app | App checks for update |
| 5 | Wait 5-10 sec | Loading indicator appears |
| 6 | Close/reopen | Update applied |
| 7 | Look for banner | "App Updated!" shows |

---

## Commands to Check Status

```bash
# Check if update was published
eas update:list

# View specific update
eas update:view <UPDATE_ID>

# Check Expo login
eas whoami

# Manually publish (if needed)
eas update --branch production
```

---

## Support

- [Expo Updates Docs](https://docs.expo.dev/eas-update/introduction/)
- [Troubleshooting Guide](./TROUBLESHOOT_OTA_UPDATES.md)
- [Action Plan](./OTA_UPDATES_ACTION_PLAN.md)

---

## Summary

**You just:**
1. ✅ Added EXPO_TOKEN to GitHub
2. ✅ Made a code change
3. ✅ Committed and pushed
4. ✅ GitHub Actions published OTA update
5. ✅ Update is now available to users

**Now test it on your phone:**
1. Force close app
2. Reopen app
3. Wait for update check
4. Look for "App Updated!" banner
5. Celebrate! 🎉

---

**Your app now has automatic OTA updates!** 🚀

Every time you push code, users will automatically get the update on next app open.
