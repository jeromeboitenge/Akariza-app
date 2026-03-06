# 🎨 Quick Logo Setup Instructions

## What I've Done

✅ Created logo integration infrastructure
✅ Added AkarizaLogo component
✅ Created preparation script
✅ Committed and pushed to GitHub (2 new commits!)

## What You Need to Do

### Step 1: Save Your Logo
Save the logo image you showed me as `akariza-logo.png` in the mobile app root directory.

### Step 2: Run the Preparation Script

```bash
# Make sure you're in the mobile app directory
cd ~/Desktop/akariza/mobile

# Run the logo preparation script
./prepare-logo.sh
```

The script will:
- Check if your logo file exists
- Create all required sizes (icon, splash, favicon)
- Save them in the `assets/` folder
- Give you next steps

### Step 3: Commit the Logo Files

```bash
git add assets/
git commit -m "feat: Add Akariza logo assets to app"
git push origin main
```

### Step 4: Rebuild the App

```bash
eas build --platform android --profile preview
```

## Alternative Method (If Script Doesn't Work)

1. Go to https://www.appicon.co/
2. Upload your logo
3. Download all generated sizes
4. Place them in the `assets/` folder:
   - icon.png (1024x1024)
   - adaptive-icon.png (512x512)
   - splash.png (1284x2778)
   - favicon.png (48x48)
5. Commit and rebuild

## Where the Logo Will Appear

After rebuilding, your logo will show in:
- 📱 App icon on phone home screen
- 🚀 Splash screen when launching
- 🔐 Login screen (via AkarizaLogo component)
- 📝 Signup screen (via AkarizaLogo component)
- ⚙️ Any other screen where you add `<AkarizaLogo />`

## Using the Logo Component in Code

```tsx
import { AkarizaLogo } from '../components';

// Simple usage
<AkarizaLogo />

// With custom size
<AkarizaLogo size={150} />

// With tagline
<AkarizaLogo size={120} showTagline={true} />
```

## GitHub Commits

I've made 2 commits for you:

1. **feat: Add signup screen and enhance authentication flow**
   - Signup screen
   - Enhanced login
   - Purchase orders module
   - Documentation

2. **feat: Add logo integration support**
   - AkarizaLogo component
   - Logo preparation script
   - Integration guide

## Next Steps

1. Save your logo as `akariza-logo.png`
2. Run `./prepare-logo.sh`
3. Commit the assets
4. Rebuild the app
5. Your logo will be in the app! 🎉

Need help? Check `LOGO_INTEGRATION_GUIDE.md` for detailed instructions.
