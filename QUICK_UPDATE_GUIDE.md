# 🚀 Quick Update Guide - How to Push Updates to Your App

## The Problem You Had
- You push code to GitHub
- App on phone doesn't update
- You wondered why changes don't show

## The Solution: OTA Updates ✅

I've just enabled **Over-The-Air (OTA) updates** for your app!

## How It Works Now

### Old Way (Before):
```
1. Make code changes
2. Push to GitHub
3. Rebuild entire APK (15-20 minutes)
4. Download new APK
5. Reinstall on phone
```

### New Way (Now):
```
1. Make code changes
2. Push to GitHub
3. Run: ./publish-update.sh (1-2 minutes)
4. App updates automatically on next launch
```

## 📱 Step-by-Step: Pushing Updates

### 1. Make Your Code Changes
```bash
# Edit any file
vim src/screens/LoginScreen.tsx
```

### 2. Commit and Push to GitHub
```bash
git add .
git commit -m "feat: Update login screen"
git push origin main
```

### 3. Publish the Update
```bash
./publish-update.sh
```

That's it! Your app will update automatically.

### 4. Test on Your Phone
1. Close the app completely
2. Wait 1-2 minutes
3. Open the app
4. The update is applied!

## ⚡ What Can Be Updated OTA?

### ✅ Can Update Without Rebuild:
- JavaScript/TypeScript code
- React components
- UI changes
- API calls
- Business logic
- Styles
- Navigation
- Screen content

### ❌ Requires Rebuild:
- App icon/splash screen
- Native modules
- Permissions
- app.json major changes

## 🎯 Quick Commands

```bash
# Publish update (easiest way)
./publish-update.sh

# Check if update was published
eas update:list --branch preview

# View update details
eas update:view [update-id]
```

## 🔄 Complete Workflow Example

```bash
# 1. Make changes
echo "console.log('Updated!');" >> src/App.tsx

# 2. Commit
git add .
git commit -m "feat: Add console log"
git push origin main

# 3. Publish
./publish-update.sh

# 4. Wait 1-2 minutes

# 5. Restart app on phone
# Update is applied! ✅
```

## 📊 What I Changed

1. **app.json**: Added OTA update configuration
2. **publish-update.sh**: Created easy publish script
3. **OTA_UPDATES_GUIDE.md**: Detailed documentation

## 🎉 Benefits

- **Fast**: Updates in 1-2 minutes vs 15-20 minutes rebuild
- **Easy**: One command to publish
- **Automatic**: Users get updates on app launch
- **No Reinstall**: Updates apply seamlessly
- **More Commits**: Each update = GitHub commit!

## ⚠️ Important Notes

### First Time Setup:
You need to **rebuild the app once** with OTA enabled:

```bash
eas build --platform android --profile preview
```

After this rebuild, all future JavaScript changes can be pushed via OTA!

### When to Rebuild vs Update:

**Use OTA Update** (./publish-update.sh):
- Bug fixes
- UI changes
- New features (JavaScript only)
- API updates
- Style changes

**Rebuild APK** (eas build):
- First time enabling OTA
- Adding native modules
- Changing app icon
- Updating permissions

## 🚨 Troubleshooting

### Update not showing?
```bash
# 1. Check update was published
eas update:list --branch preview

# 2. Wait 2 minutes

# 3. Close app completely

# 4. Reopen app
```

### Still not working?
- Rebuild app once with OTA enabled
- Make sure you're using the preview channel
- Check internet connection on phone

## ✅ Next Steps

1. **Rebuild app once** (to enable OTA):
   ```bash
   eas build --platform android --profile preview
   ```

2. **Install new build** on your phone

3. **Make a code change** and test:
   ```bash
   # Change something
   vim src/screens/LoginScreen.tsx
   
   # Push update
   git add . && git commit -m "test" && git push
   ./publish-update.sh
   
   # Restart app - see the change!
   ```

4. **Enjoy fast updates!** 🎉

## 📈 GitHub Commits

I've made **4 commits** for you today:

1. ✅ Authentication & Purchase Orders
2. ✅ Logo integration support
3. ✅ Logo setup instructions
4. ✅ OTA updates enabled

Each time you publish an update, you can commit to GitHub = more commits! 📊

---

**Summary**: You can now push updates to your app in 1-2 minutes instead of rebuilding. Just run `./publish-update.sh` after pushing to GitHub!

Check `OTA_UPDATES_GUIDE.md` for detailed information.
