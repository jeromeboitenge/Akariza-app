# 📱 Akariza Mobile - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Configuration
- [ ] Update API_URL in `src/utils/constants.ts` to production URL
- [ ] Verify app.json version numbers
- [ ] Check bundleIdentifier (iOS) and package (Android)
- [ ] Verify app name and description
- [ ] Update splash screen and icons if needed

### 2. Testing
- [ ] Test all user flows (login, sales, purchases, etc.)
- [ ] Test on different screen sizes
- [ ] Test offline functionality
- [ ] Test with different user roles
- [ ] Test error scenarios
- [ ] Performance testing

### 3. Security
- [ ] Remove console.log statements (or use production logger)
- [ ] Verify API keys are not hardcoded
- [ ] Check authentication flows
- [ ] Test token refresh
- [ ] Verify data encryption

---

## 🏗️ Building the App

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Build Preview (for testing)
```bash
# Android APK
eas build --profile preview --platform android

# iOS (requires Apple Developer account)
eas build --profile preview --platform ios
```

### Step 4: Build Production
```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios

# Both
eas build --profile production --platform all
```

---

## 📦 Publishing Updates

### After Initial Build
```bash
# Make code changes
# Then publish update

# Preview
eas update --branch preview --message "Your update message"

# Production
eas update --branch production --message "Your update message"
```

---

## 🚀 Distribution

### Android
1. Download APK from Expo dashboard
2. Test on physical device
3. Upload to Google Play Console
4. Fill in store listing
5. Submit for review

### iOS
1. Download IPA from Expo dashboard
2. Upload to App Store Connect
3. Fill in app information
4. Submit for review

---

## 📊 Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor crash reports
- [ ] Track user analytics
- [ ] Monitor API performance
- [ ] Check update adoption rates

### User Feedback
- [ ] Set up feedback mechanism
- [ ] Monitor app store reviews
- [ ] Create support channels
- [ ] Document common issues

---

## 🔄 Update Workflow

1. Make changes in code
2. Test locally
3. Publish to preview: `eas update --branch preview`
4. Test on preview build
5. Publish to production: `eas update --branch production`
6. Monitor adoption

---

**Your app is ready for deployment!** 🎉
