# 🚀 Quick Start - Build Your APK

## Step 1: Install EAS CLI (One-time setup)
```bash
npm install -g eas-cli
```

## Step 2: Login to Expo
```bash
cd mobile
eas login
```
Create a free account at https://expo.dev if you don't have one.

## Step 3: Build APK
```bash
# Use the build script
./build.sh

# Or manually:
eas build --platform android --profile preview
```

## Step 4: Download & Install
- Wait 10-15 minutes for build to complete
- Download APK from the link provided
- Install on your phone

## 🔄 Publishing Updates (After Code Changes)

```bash
cd mobile

# Commit your changes
git add -A
git commit -m "Your changes"
git push

# Publish OTA update
eas update --branch production --message "Bug fixes"
```

Users will receive the update automatically on next app restart!

## 📱 First Time Build Checklist

1. ✅ Install EAS CLI: `npm install -g eas-cli`
2. ✅ Login: `eas login`
3. ✅ Configure: `eas build:configure` (if prompted)
4. ✅ Build: `eas build -p android --profile preview`
5. ✅ Download APK from link
6. ✅ Install on phone

## 🎯 Common Commands

```bash
# Build preview APK (faster, for testing)
eas build -p android --profile preview

# Build production APK (optimized)
eas build -p android --profile production

# Publish update (no reinstall needed)
eas update --branch production -m "Update message"

# Check build status
eas build:list

# View updates
eas update:list
```

## 💡 Pro Tips

- **First build**: Use `preview` profile (faster)
- **Code updates**: Use `eas update` (instant, no APK rebuild)
- **Native changes**: Rebuild APK (new dependencies, permissions)
- **Share APK**: Send download link to users

## 🆘 Troubleshooting

**Build fails?**
- Check internet connection
- Ensure you're logged in: `eas whoami`
- Try again: `eas build -p android --profile preview`

**Update not working?**
- Ensure app was built with EAS
- Check update branch matches
- Restart app to apply update

## 📞 Need Help?

Check full guide: `BUILD_GUIDE.md`
