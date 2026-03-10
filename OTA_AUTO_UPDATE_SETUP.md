# Automatic OTA Updates on Push - Setup Guide

## Problem
Your mobile app is configured for OTA updates, but updates don't happen automatically when you push code to GitHub. You need to manually run `eas update` each time.

## Solution
Set up GitHub Actions to automatically publish OTA updates whenever you push code.

## Setup Steps

### Step 1: Create Expo Token

1. Go to https://expo.dev/settings/tokens
2. Click "Create Token"
3. Name it: `GITHUB_OTA_UPDATE`
4. Copy the token

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: Paste the token from Step 1
6. Click "Add secret"

### Step 3: Verify Workflow File

The workflow file is already created at `.github/workflows/ota-update.yml`

It will:
- Trigger on push to main/master branch
- Only run when src/ or app.json changes
- Install dependencies
- Publish OTA update automatically
- Notify on success/failure

### Step 4: Test It

1. Make a small code change
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: trigger OTA update"
   git push origin main
   ```

3. Go to GitHub → Actions tab
4. Watch the workflow run
5. Check your phone - app will get update on next open

## How It Works

### Automatic Flow
```
You push code to GitHub
         ↓
GitHub Actions triggered
         ↓
EAS CLI publishes update
         ↓
Update available on Expo servers
         ↓
User opens app
         ↓
App checks for updates
         ↓
Update downloaded & installed
         ↓
User sees latest version
```

### What Gets Updated
- ✅ JavaScript code
- ✅ UI components
- ✅ Styles
- ✅ API endpoints
- ✅ Business logic
- ❌ Native modules (requires rebuild)
- ❌ Permissions (requires rebuild)

## Workflow Triggers

The workflow runs when:
- You push to `main` or `master` branch
- AND you change files in `src/` or `app.json`

To force an update even without changes:
```bash
# Make a dummy change
echo "# Updated" >> README.md
git add README.md
git commit -m "trigger: force OTA update"
git push origin main
```

## Monitoring Updates

### Check GitHub Actions
1. Go to your repository
2. Click "Actions" tab
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

### Check on Your Phone
1. Open the app
2. Wait for update check (usually instant)
3. App will download update in background
4. Close and reopen app to apply update

## Troubleshooting

### Workflow Not Running
- Check GitHub Actions is enabled
- Verify you pushed to main/master
- Check you changed src/ or app.json
- View workflow logs in Actions tab

### Update Not Received
- Ensure app has internet connection
- Force close and reopen app
- Check app version matches
- Verify Expo token is valid

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

### Manual Publish (Fallback)
If workflow fails, publish manually:
```bash
eas update --branch production
```

## Best Practices

### 1. Test Before Pushing
```bash
# Test locally first
npm start

# Then push
git push origin main
```

### 2. Meaningful Commits
```bash
# Good
git commit -m "feat: add product search"
git commit -m "fix: fix login bug"

# Bad
git commit -m "update"
git commit -m "changes"
```

### 3. Monitor Updates
- Check GitHub Actions after each push
- Verify update published successfully
- Test on device to confirm

### 4. Gradual Rollout
For major changes:
```bash
# Test on staging first
eas update --branch staging

# Then production
eas update --branch production
```

## Advanced Configuration

### Update Only on Specific Branches
Edit `.github/workflows/ota-update.yml`:
```yaml
on:
  push:
    branches: [main]  # Only main branch
```

### Update on Schedule
Add scheduled updates:
```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
```

### Update with Custom Message
```yaml
- name: Publish OTA Update
  run: |
    eas update --branch production --auto
    echo "📱 Update published at $(date)"
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
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

To use different branches in workflow:
```yaml
- name: Publish OTA Update
  run: eas update --branch ${{ github.ref_name }}
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
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

## Monitoring & Alerts

### Email Notifications
GitHub Actions can send email on failure:
1. Go to repository Settings
2. Click Notifications
3. Enable email alerts

### Slack Notifications
Add to workflow:
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ OTA Update failed"
      }
```

## Performance Impact

- **Update Size**: Typically 1-5 MB
- **Download Time**: 5-30 seconds (depends on connection)
- **Installation Time**: Instant (on next app open)
- **User Impact**: Minimal (background download)

## Security

- ✅ Updates are signed
- ✅ Verified before installation
- ✅ Only from Expo servers
- ✅ Token stored securely in GitHub Secrets
- ✅ No credentials in code

## Limits

- **Update Size**: Up to 50 MB
- **Frequency**: No limit
- **Retention**: 30 days
- **Branches**: Unlimited

## Quick Reference

```bash
# Manual publish (if needed)
eas update --branch production

# List updates
eas update:list

# View update details
eas update:view <UPDATE_ID>

# Republish previous
eas update:republish --branch production

# Check status
eas update:list --branch production --limit 5
```

## Next Steps

1. ✅ Create Expo token
2. ✅ Add to GitHub Secrets
3. ✅ Workflow file is ready
4. ✅ Make a test commit
5. ✅ Watch GitHub Actions
6. ✅ Check your phone for update

## Support

- [Expo Updates Docs](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Now when you push code, your app will automatically receive updates!** 🚀
