# 🎯 BUILD YOUR APK - 3 SIMPLE STEPS

## 1️⃣ Install EAS CLI (One time only)
```bash
npm install -g eas-cli
```

## 2️⃣ Login to Expo
```bash
cd /home/boitenge/Desktop/akariza/mobile
eas login
```
Create free account at: https://expo.dev

## 3️⃣ Build APK
```bash
eas build --platform android --profile preview
```

⏱️ Wait 10-15 minutes → Get download link → Install on phone!

---

## 🔄 UPDATE YOUR APP (After making changes)

```bash
cd /home/boitenge/Desktop/akariza/mobile

# Commit changes
git add -A
git commit -m "Your changes"
git push

# Publish update (users get it automatically!)
eas update --branch production --message "Bug fixes and improvements"
```

✨ Users receive updates automatically on next app restart - NO REINSTALL NEEDED!

---

## 📱 WHAT YOU GET

✅ **APK file** - Install directly on any Android phone
✅ **OTA Updates** - Push updates without rebuilding APK
✅ **No scanning** - Direct installation
✅ **Automatic updates** - Users always have latest version

---

## 🚀 READY TO BUILD?

Run this now:
```bash
cd /home/boitenge/Desktop/akariza/mobile
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

That's it! 🎉
