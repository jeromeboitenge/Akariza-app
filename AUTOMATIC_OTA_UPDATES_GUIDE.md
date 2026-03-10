# Automatic OTA Updates - Complete Setup Guide

## The Problem

Your mobile app is configured for OTA updates, but **updates don't happen automatically when you push to GitHub**. You have to manually run `eas update --branch production` each time.

## The Solution

Set up GitHub Actions to automatically publish OTA updates whenever you push code.

## Quick Setup (5 minutes)

### Step 1: Get Expo Token (2 minutes)

1. Go to https://expo.dev/settings/tokens
2. Click "Create Token"
3. Name: `GITHUB_OTA_UPDATE`
4. Copy the token (save it somewhere safe)

### Step 2: Add Token to GitHub (2 minutes)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `EXPO_TOKEN`
5. Value: Paste your token from Step 1
6. Click **Add secret**

### Step 3: Done! (1 minute)

The workflow file is already created at `.github/workflows/ota-update.yml`

Now whenever you push code, your app will automatically receive updates!

## How It Works

```
You push code to GitHub
         ↓
GitHub Actions triggered
         ↓
EAS CLI publishes OTA update
         ↓
Update available on Expo servers
         ↓
User opens app
         ↓
App checks for updates
         ↓
Update downloaded & installed
         ↓
User sees latest version ✅
```

## Test It

1. Make a small code change:
   ```bash
   # Edit any file in src/
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "test: trigger OTA update"
   git push origin main
   ```

3. Watch GitHub Actions:
   - Go to your repository
   - Click **Actions** tab
   - See the workflow running

4. Check your phone:
   - Open the app
   - Wait a few seconds
   - App will download update in background
   - Close and reopen app to apply update

## What Gets Updated

✅ **JavaScript code** - All your app logic
✅ **UI components** - Screens and layouts
✅ **Styles** - Colors, fonts, spacing
✅ **API endpoints** - Backend URLs
✅ **Business logic** - Features and functionality

❌ **Native modules** - Requires rebuild
❌ **Permissions** - Requires rebuild
❌ **SDK updates** - Requires rebuild

## Workflow Details

The workflow file (`.github/workflows/ota-update.yml`) does:

1. **Triggers on push** to main/master branch
2. **Only runs** when src/ or app.json changes
3. **Installs dependencies**
4. **Publishes OTA update** using EAS CLI
5. **Notifies** on success/failure

## Manual Publish (Fallback)

If you need to publish manually:

```bash
# Publish to production
eas update --branch production

# Publish to staging (for testing)
eas update --branch staging

# List recent updates
eas update:list

# View update details
eas update:view <UPDATE_ID>
```

## Troubleshooting

### Workflow Not Running
- ✅ Check GitHub Actions is enabled
- ✅ Verify you pushed to main/master
- ✅ Check you changed src/ or app.json
- ✅ View workflow logs in Actions tab

### Update Not Received
- ✅ Ensure app has internet connection
- ✅ Force close and reopen app
- ✅ Check app version matches
- ✅ Verify Expo token is valid

### Token Issues
```bash
# Test token locally
eas update --branch production

# If fails, regenerate token:
# 1. Go to https://expo.dev/settings/tokens
# 2. Delete old token
# 3. Create new token
# 4. Update GitHub secret
```

## Advanced Features

### Update Only Specific Branches
Edit `.github/workflows/ota-update.yml`:
```yaml
on:
  push:
    branches: [main]  # Only main branch
```

### Scheduled Updates
Add to workflow:
```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
```

### Slack Notifications
Add to workflow:
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

## Update Branches

Use different branches for different environments:

```bash
# Production (all users)
eas update --branch production

# Staging (testing)
eas update --branch staging

# Development (internal)
eas update --branch development
```

## Rollback Updates

If an update causes issues:

```bash
# Option 1: Publish a fix
git revert <COMMIT_HASH>
git push origin main
# Workflow will auto-publish fix

# Option 2: Republish previous version
eas update:republish --branch production
```

## Monitoring

### Check GitHub Actions
1. Go to your repository
2. Click **Actions** tab
3. See workflow runs and status

### Check Expo Dashboard
```bash
# List recent updates
eas update:list

# View specific branch
eas update:list --branch production

# View update details
eas update:view <UPDATE_ID>
```

## Performance

- **Update Size**: Typically 1-5 MB
- **Download Time**: 5-30 seconds
- **Installation Time**: Instant (on next app open)
- **User Impact**: Minimal (background download)

## Security

✅ Updates are signed
✅ Verified before installation
✅ Only from Expo servers
✅ Token stored securely in GitHub Secrets
✅ No credentials in code

## Limits

- **Update Size**: Up to 50 MB
- **Frequency**: No limit
- **Retention**: 30 days
- **Branches**: Unlimited

## Quick Commands

```bash
# Publish update manually
eas update --branch production

# List updates
eas update:list

# View update details
eas update:view <UPDATE_ID>

# Republish previous update
eas update:republish --branch production

# Check update status
eas update:list --branch production --limit 5
```

## Files Created

- `.github/workflows/ota-update.yml` - GitHub Actions workflow
- `OTA_AUTO_UPDATE_SETUP.md` - Detailed setup guide
- `setup-ota-auto-update.sh` - Setup verification script

## Next Steps

1. ✅ Create Expo token (https://expo.dev/settings/tokens)
2. ✅ Add EXPO_TOKEN to GitHub Secrets
3. ✅ Make a test commit and push
4. ✅ Watch GitHub Actions
5. ✅ Check your phone for update

## Support

- [Expo Updates Docs](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**That's it! Your app will now automatically receive updates when you push to GitHub.** 🚀

When you push code:
1. GitHub Actions automatically publishes the update
2. Users get notified on next app open
3. Update downloads in background
4. Applied on next app restart

No more manual `eas update` commands needed!
