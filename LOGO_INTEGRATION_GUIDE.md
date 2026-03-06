# Akariza Logo Integration Guide

## 📱 How to Add Your Logo to the App

### Step 1: Prepare Logo Files

You'll need to create different sizes of your logo for various purposes:

1. **App Icon** (Square versions):
   - 1024x1024 px (icon.png) - Main app icon
   - 512x512 px (adaptive-icon.png) - Android adaptive icon
   - 48x48 px (favicon.png) - Web favicon

2. **Splash Screen** (Can be rectangular):
   - 1284x2778 px (splash.png) - Launch screen

### Step 2: Save Logo Files

Save your logo image and create the required sizes, then place them in the `assets` folder:

```
assets/
├── icon.png           (1024x1024 - square version of logo)
├── adaptive-icon.png  (512x512 - square version)
├── splash.png         (1284x2778 - can include tagline)
└── favicon.png        (48x48 - square version)
```

### Step 3: Update app.json

The app.json is already configured to use these files:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#5C6BF2"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#5C6BF2"
      }
    }
  }
}
```

### Step 4: Add Logo to Login Screen

I've created a logo component that you can use. The logo will be displayed on:
- Login Screen
- Signup Screen
- Splash Screen

### Step 5: Rebuild the App

After adding the logo files:

```bash
# Clear cache
rm -rf .expo

# Rebuild
eas build --platform android --profile preview
```

## 🎨 Logo Design Recommendations

Based on your logo:

1. **Background Color**: Use white or light background (#FFFFFF or #F5F5F5)
2. **Primary Color**: Blue (#2196F3 or similar from logo)
3. **Secondary Color**: Green (#4CAF50 or similar from logo)

### For App Icon (Square):
- Use just the shopping cart with buildings
- Remove the text "Akariza" and tagline
- Center the graphic
- Add padding around edges

### For Splash Screen (Rectangular):
- Use full logo with text
- Include "WE ARE HERE FOR YOU" tagline
- Center on screen
- Use white or light blue background

## 📐 Creating Logo Sizes

### Using Online Tools:
1. Go to https://www.appicon.co/
2. Upload your logo
3. Generate all required sizes
4. Download and place in assets folder

### Using Command Line (ImageMagick):
```bash
# Install ImageMagick
sudo apt-get install imagemagick  # Linux
brew install imagemagick          # macOS

# Resize logo
convert akariza-logo.png -resize 1024x1024 assets/icon.png
convert akariza-logo.png -resize 512x512 assets/adaptive-icon.png
convert akariza-logo.png -resize 48x48 assets/favicon.png
```

## 🖼️ Logo Component Usage

I've created a reusable logo component:

```tsx
import { AkarizaLogo } from '../components/AkarizaLogo';

// In your screen:
<AkarizaLogo size={120} showTagline={true} />
```

## ✅ Checklist

- [ ] Save logo image to your computer
- [ ] Create required sizes (1024x1024, 512x512, 1284x2778, 48x48)
- [ ] Place files in `assets/` folder
- [ ] Verify app.json configuration
- [ ] Test logo appears in app
- [ ] Rebuild app with new logo
- [ ] Test on phone

## 🎯 Quick Steps

1. **Save your logo** as `akariza-logo-original.png`
2. **Use online tool** like appicon.co to generate all sizes
3. **Replace files** in `assets/` folder
4. **Commit changes**:
   ```bash
   git add assets/
   git commit -m "feat: Add Akariza logo to app"
   git push origin main
   ```
5. **Rebuild app**:
   ```bash
   eas build --platform android --profile preview
   ```

## 📱 Where Logo Appears

After integration, your logo will appear in:
- ✅ App icon on phone home screen
- ✅ Splash screen when app launches
- ✅ Login screen header
- ✅ Signup screen header
- ✅ About section (if added)
- ✅ App settings

## 🔄 Next Build

The logo will be included in your next build. Make sure to:
1. Add logo files to assets folder
2. Commit and push changes
3. Run build command
4. Download and install new APK

Your logo looks great! The blue and green colors match well with the app's theme. 🎨
