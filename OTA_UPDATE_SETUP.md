# OTA Updates Setup Guide

This guide explains how to set up and use Over-The-Air (OTA) updates for the Akariza mobile app.

## What is OTA Updates?

Over-The-Air (OTA) updates allow you to push code changes to your app without requiring users to download a new version from the app store. Users get updates automatically when they open the app.

## Current Configuration

The app is already configured for OTA updates:

```json
{
  "updates": {
    "enabled": true,
    "checkAutomatically": "ON_LOAD",
    "fallbackToCacheTimeout": 0,
    "url": "https://u.expo.dev/4556b8d7-8b86-4c92-9e05-dc82bba1cebf"
  },
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
```

### Configuration Explanation

- **enabled**: OTA updates are enabled
- **checkAutomatically**: Check for updates when app loads
- **fallbackToCacheTimeout**: Use cached version if update check fails
- **url**: Expo update server URL
- **runtimeVersion**: Uses app version (1.0.1) to manage compatibility

## Prerequisites

1. **Expo Account**: Create at https://expo.dev
2. **EAS CLI**: Install with `npm install -g eas-cli`
3. **Logged In**: Run `eas login` with your Expo credentials

## Publishing OTA Updates

### Step 1: Make Code Changes

Edit your code as usual:
```bash
# Edit files
git add .
git commit -m "feat: your changes"
```

### Step 2: Publish Update

```bash
# Publish to production
eas update --branch production

# Or publish to a specific branch
eas update --branch staging
```

### Step 3: Users Receive Update

When users open the app:
1. App checks for updates on load
2. If update available, downloads in background
3. Update applied on next app restart
4. User sees latest version

## Update Branches

Different branches for different environments:

```bash
# Production (all users)
eas update --branch production

# Staging (testing)
eas update --branch staging

# Development (internal testing)
eas update --branch development
```

## Automated Update Script

Create a script to automate updates:

```bash
#!/bin/bash
# update-app.sh

echo "🚀 Publishing OTA Update..."

# Get branch from argument or default to production
BRANCH=${1:-production}

# Publish update
eas update --branch $BRANCH

if [ $? -eq 0 ]; then
  echo "✅ Update published to $BRANCH"
  echo "📱 Users will receive update on next app open"
else
  echo "❌ Update failed"
  exit 1
fi
```

Usage:
```bash
chmod +x update-app.sh
./update-app.sh production
```

## Update Workflow

### Development Workflow

```bash
# 1. Make changes
git add .
git commit -m "feat: new feature"

# 2. Test locally
npm start

# 3. Publish to staging
eas update --branch staging

# 4. Test on device
# Open app on test device, should get update

# 5. Publish to production
eas update --branch production

# 6. Push to GitHub
git push origin main
```

### Continuous Integration

Set up automatic updates on push:

```yaml
# .github/workflows/ota-update.yml
name: OTA Update

on:
  push:
    branches: [main]

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install -g eas-cli
      - run: eas update --branch production
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Monitoring Updates

### Check Update Status

```bash
# View recent updates
eas update:list

# View specific branch
eas update:list --branch production

# View update details
eas update:view <UPDATE_ID>
```

### View Update History

```bash
# List all updates
eas update:list --limit 50

# Export update history
eas update:list --json > updates.json
```

## Rollback Updates

If an update causes issues:

```bash
# Publish a fix
git revert <COMMIT_HASH>
git push origin main
eas update --branch production

# Or rollback to previous version
eas update:republish --branch production
```

## Update Strategies

### Strategy 1: Immediate Updates

Users get updates on next app open:

```json
{
  "updates": {
    "checkAutomatically": "ON_LOAD"
  }
}
```

### Strategy 2: Scheduled Updates

Check for updates at specific times:

```json
{
  "updates": {
    "checkAutomatically": "ON_LOAD_OR_RESTART"
  }
}
```

### Strategy 3: Manual Updates

Users manually check for updates:

```json
{
  "updates": {
    "checkAutomatically": "NEVER"
  }
}
```

## Update Types

### JavaScript Updates (OTA)
- Code changes
- UI updates
- Bug fixes
- Feature additions

**No app store submission needed!**

### Native Updates (Requires App Store)
- Native module changes
- Permission changes
- SDK updates
- Build configuration changes

## Best Practices

1. **Test Before Publishing**
   - Test locally first
   - Use staging branch for testing
   - Get feedback before production

2. **Version Management**
   - Increment version for major changes
   - Use semantic versioning
   - Document changes in CHANGELOG

3. **Gradual Rollout**
   - Start with staging branch
   - Monitor for issues
   - Publish to production

4. **Communication**
   - Notify users of major updates
   - Document breaking changes
   - Provide release notes

5. **Monitoring**
   - Check update status
   - Monitor error rates
   - Track user adoption

## Troubleshooting

### Update Not Received

1. Check internet connection
2. Verify app is on latest version
3. Force app restart
4. Clear app cache

### Update Failed

```bash
# Check update status
eas update:list

# View error logs
eas update:view <UPDATE_ID>

# Retry update
eas update --branch production
```

### Rollback Needed

```bash
# Revert code
git revert <COMMIT_HASH>

# Publish fix
eas update --branch production
```

## Environment Variables

Set environment variables for updates:

```bash
# In app.json
{
  "expo": {
    "extra": {
      "API_URL": "https://api.example.com",
      "ENV": "production"
    }
  }
}
```

Access in code:
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.API_URL;
```

## Update Manifest

View update manifest:

```bash
# Get manifest URL
eas update:list --branch production

# View manifest
curl https://u.expo.dev/<PROJECT_ID>/manifest
```

## Performance Considerations

- Updates are downloaded in background
- Applied on next app restart
- Minimal impact on app performance
- Cache fallback if update fails

## Security

- Updates are signed
- Verified before installation
- Only from trusted Expo servers
- No man-in-the-middle attacks

## Limits

- **Update Size**: Up to 50MB
- **Frequency**: No limit
- **Retention**: 30 days
- **Branches**: Unlimited

## Pricing

- **Free Tier**: 1 project, limited updates
- **Paid Tier**: Unlimited projects and updates

See https://expo.dev/pricing for details.

## Resources

- [Expo Updates Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas-cli/introduction/)
- [Update Strategies](https://docs.expo.dev/eas-update/strategies/)
- [Troubleshooting](https://docs.expo.dev/eas-update/troubleshooting/)

## Quick Commands

```bash
# Publish update
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

## Next Steps

1. Make code changes
2. Test locally
3. Commit to GitHub
4. Run `eas update --branch production`
5. Users receive update on next app open

That's it! Your app now has automatic OTA updates.
