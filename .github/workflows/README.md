# GitHub Actions Workflows

## OTA Update Workflow (Currently Disabled)

The OTA (Over-The-Air) update workflow is currently disabled to prevent build failures.

### Why is it disabled?

The workflow requires:
1. **EXPO_TOKEN** secret to be configured in GitHub repository settings
2. A valid Expo account with EAS (Expo Application Services) access
3. The app to be built at least once with EAS before OTA updates can work

### How to enable OTA updates

1. **Get your Expo token:**
   ```bash
   npx expo login
   npx eas whoami
   npx eas token:create
   ```

2. **Add the token to GitHub:**
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Paste your token from step 1

3. **Enable the workflow:**
   ```bash
   cd mobile/.github/workflows
   mv ota-update.yml.disabled ota-update.yml
   git add .
   git commit -m "chore: enable OTA update workflow"
   git push
   ```

4. **Build your app first:**
   ```bash
   # Build for Android
   eas build --platform android --profile production
   
   # Or build for iOS
   eas build --platform ios --profile production
   ```

5. **Test OTA updates:**
   After the build completes, any push to the `main` branch that changes files in `src/` or `app.json` will automatically publish an OTA update.

### What are OTA updates?

OTA updates allow you to push JavaScript and asset updates to your app without going through the app store review process. Users will automatically receive updates when they open the app.

**Note:** OTA updates can only update JavaScript code and assets. Native code changes (like adding new native modules) require a new app store build.

### Alternative: Manual OTA updates

If you don't want automatic updates, you can publish manually:

```bash
# Publish to production channel
eas update --branch production --message "Bug fixes and improvements"

# Publish to preview channel
eas update --branch preview --message "Testing new features"
```

### Troubleshooting

**Error: "No EXPO_TOKEN found"**
- Make sure you've added the EXPO_TOKEN secret in GitHub repository settings

**Error: "Project not found"**
- Run `eas build` at least once to register your project with EAS

**Error: "No builds found"**
- OTA updates require at least one build to exist
- Run `eas build --platform android` or `eas build --platform ios`

**Error: "Runtime version mismatch"**
- Make sure your `runtimeVersion` in `app.json` matches your build
- Current setting: `"policy": "appVersion"` (uses version from app.json)

### Documentation

- [Expo EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [GitHub Actions for Expo](https://docs.expo.dev/eas-update/github-actions/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Last Updated:** March 11, 2026
**Status:** Workflow disabled, enable when ready for OTA updates
