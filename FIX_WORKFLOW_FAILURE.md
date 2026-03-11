# Fix GitHub Actions Workflow Failure

## Problem
The "Publish OTA Update" workflow is failing when trying to publish updates.

## Most Common Causes

### 1. Invalid or Expired EXPO_TOKEN ⚠️ (Most Likely)

**Symptoms:**
- Workflow fails with authentication error
- "Invalid token" or "Unauthorized" message

**Fix:**
1. Go to https://expo.dev/settings/tokens
2. Delete the old token
3. Create a NEW token
4. Copy the new token
5. Go to GitHub → Settings → Secrets and variables → Actions
6. Click on `EXPO_TOKEN`
7. Click "Update secret"
8. Paste the new token
9. Click "Update secret"
10. Push a new change to trigger workflow

### 2. EXPO_TOKEN Not Set in GitHub

**Symptoms:**
- Workflow fails immediately
- "EXPO_TOKEN not found" error

**Fix:**
1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Check if `EXPO_TOKEN` exists
4. If not, create it:
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Your Expo token
   - Click "Add secret"

### 3. npm install Failing

**Symptoms:**
- Workflow fails at "Install dependencies" step
- npm error messages

**Fix:**
```bash
# Locally, verify package.json is valid
npm install

# If it works locally, push the fix
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push origin main
```

### 4. EAS CLI Issues

**Symptoms:**
- "eas: command not found"
- EAS CLI installation fails

**Fix:**
The workflow already installs EAS CLI globally. If it fails:
1. Check npm is working
2. Check internet connection
3. Try manually:
   ```bash
   npm install -g eas-cli
   eas --version
   ```

## Step-by-Step Fix

### Step 1: Regenerate EXPO_TOKEN

1. Go to https://expo.dev/settings/tokens
2. Click the token you created
3. Click "Delete" (or create a new one)
4. Click "Create Token"
5. Name: `GITHUB_OTA_UPDATE_NEW`
6. Copy the token

### Step 2: Update GitHub Secret

1. Go to your GitHub repository
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Click on `EXPO_TOKEN`
5. Click **Update secret**
6. Paste the new token
7. Click **Update secret**

### Step 3: Test the Workflow

1. Make a small change:
   ```bash
   echo "// test" >> README.md
   ```

2. Commit and push:
   ```bash
   git add README.md
   git commit -m "test: trigger workflow"
   git push origin main
   ```

3. Go to GitHub → **Actions** tab
4. Watch the workflow run
5. It should now succeed ✅

## Verify Token is Valid

### Test Locally

```bash
# Install EAS CLI
npm install -g eas-cli

# Login with token
eas login --non-interactive
# Set EXPO_TOKEN environment variable first:
export EXPO_TOKEN="your_token_here"
eas login --non-interactive

# Try to publish
eas update --branch production

# If it works, token is valid
```

### Check Token Expiration

1. Go to https://expo.dev/settings/tokens
2. Look at your token
3. Check if it has an expiration date
4. If expired, create a new one

## Updated Workflow

The workflow has been updated to:
1. Explicitly authenticate with Expo
2. Better error handling
3. Clearer logging

The new workflow includes:
```yaml
- name: Authenticate with Expo
  run: eas login --non-interactive
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

This ensures proper authentication before publishing.

## Quick Checklist

- [ ] EXPO_TOKEN exists in GitHub Secrets
- [ ] EXPO_TOKEN is not expired
- [ ] EXPO_TOKEN is valid (test locally)
- [ ] package.json is valid
- [ ] npm install works locally
- [ ] eas update works locally
- [ ] Workflow file is correct
- [ ] Pushing to main/master branch

## If Still Failing

### Check Workflow Logs

1. Go to GitHub → **Actions**
2. Click the failed workflow
3. Click **publish-update** job
4. Expand each step to see logs
5. Look for error messages

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Invalid token` | Regenerate EXPO_TOKEN |
| `Unauthorized` | Check token is valid |
| `EXPO_TOKEN not found` | Add to GitHub Secrets |
| `npm ERR!` | Run `npm install` locally |
| `eas: command not found` | Check npm install step |
| `Project not found` | Check app.json projectId |

### Manual Publish (Fallback)

If workflow keeps failing, publish manually:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Publish
eas update --branch production

# Verify
eas update:list
```

## Support

- [Expo Documentation](https://docs.expo.dev/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## Next Steps

1. ✅ Regenerate EXPO_TOKEN
2. ✅ Update GitHub Secret
3. ✅ Make a test commit
4. ✅ Push to main
5. ✅ Check workflow succeeds
6. ✅ Test on phone

---

**Once workflow succeeds, your OTA updates will work automatically!** 🚀
