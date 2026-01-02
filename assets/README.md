# Assets Directory

This directory should contain the following image assets for your app:

## Required Assets

1. **icon.png** (1024x1024px)
   - App icon for iOS and Android
   - Should be a square image with no transparency (iOS requires this)

2. **splash.png** (1242x2436px recommended)
   - Splash screen image
   - Will be displayed while the app loads

3. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon foreground
   - Should work well with various background colors

4. **favicon.png** (48x48px)
   - Web favicon

5. **notification-icon.png** (96x96px)
   - Notification icon for Android

## Quick Setup Options

### Option 1: Use Expo's Asset Generator
```bash
npx expo-asset-generator
```

### Option 2: Use Online Tools
- [AppIcon.co](https://www.appicon.co/) - Generate all icons from one image
- [Expo Asset Generator](https://github.com/expo/expo-asset-generator) - Command line tool

### Option 3: Create Simple Placeholders (for development)
For now, you can create simple colored squares as placeholders:
- Use any image editor to create solid color squares
- The app will work with placeholder images for development

## Temporary Workaround

If you want to test the app immediately without creating assets, you can temporarily comment out the asset references in `app.json` or create simple 1x1 pixel images and the app will still run (just won't have custom icons).

