# UnMount App - Build & Deploy Instructions

## Current Status
✅ Settings screen with text color customization added
✅ App config fixed (removed invalid targetSdkVersion from app.json)
✅ Version bumped to 1.1.0 with versionCode 2

## Next Steps to Build the App

### Step 1: Create Missing Icon Files

Your app.json references icon files that don't exist yet. You need to create:

1. `assets/images/icon.png` - Main app icon (1024x1024 px)
2. `assets/images/adaptive-icon.png` - Android adaptive icon (1024x1024 px)  
3. `assets/images/splash-icon.png` - Splash screen icon
4. `assets/images/favicon.png` - Web favicon (48x48 px or larger)

**Simple Solution:**
You can create placeholder icons locally or use an online tool:

```bash
# On your local machine, create the assets folder
mkdir -p assets/images

# Option A: Use ImageMagick to create simple placeholders
convert -size 1024x1024 xc:#1a1a2e -fill white -gravity center \
  -pointsize 200 -annotate +0+0 'U' assets/images/icon.png
convert -size 1024x1024 xc:#1a1a2e -fill white -gravity center \
  -pointsize 200 -annotate +0+0 'U' assets/images/adaptive-icon.png
convert -size 400x400 xc:#1a1a2e -fill white -gravity center \
  -pointsize 100 -annotate +0+0 'U' assets/images/splash-icon.png
convert -size 48x48 xc:#1a1a2e -fill white -gravity center \
  -pointsize 20 -annotate +0+0 'U' assets/images/favicon.png

# Option B: Or use an online icon generator
# Visit https://www.appicon.co or https://icon.kitchen
# Upload a simple logo and download the generated icons
```

### Step 2: Build with EAS (Expo Application Services)

Once you have the icons:

```bash
# 1. Install EAS CLI if you haven't
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Build for Android (Production AAB for Play Store)
eas build --platform android --profile production

# This will:
# - Upload your code to Expo servers
# - Build an Android App Bundle (.aab file)
# - Target SDK 35 (configured via Expo's build system)
# - Take about 10-15 minutes
```

### Step 3: Download and Upload to Play Store

After the build completes:

1. Download the .aab file from the Expo build page
2. Go to Google Play Console: https://play.google.com/console
3. Navigate to your app → Production → Create new release  
4. Upload the .aab file
5. The Play Store will now accept it because it targets SDK 35

## Alternative: Local Build (Advanced)

If you prefer building locally:

```bash
# Make sure you have Android Studio and SDK installed
npx expo prebuild --platform android
cd android
./gradlew bundleRelease

# Find the AAB at:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

### Issue: Missing icon files error
**Solution:** Complete Step 1 above

### Issue: Build fails with targetSdkVersion error  
**Solution:** Already fixed! We removed it from app.json. Expo manages this through its build system.

### Issue: Package version mismatch
Run: `npx expo install --check` and `npx expo install --fix`

## What Changed

1. **Added SettingsScreen** (`components/SettingsScreen.tsx`)
   - Text color picker with 6 color options
   - Saves user preference to AsyncStorage

2. **Updated storage.ts** 
   - Added `textColor` and `textMode` to AppSettings interface
   - Default text color: #f1f5f9 (light gray)

3. **Updated index.tsx**
   - Added 'settings' tab type
   - Imported SettingsScreen component
   - Added render case for settings tab

4. **Fixed app.json**
   - Removed invalid `targetSdkVersion` field  
   - This is now managed by Expo's build system automatically

## Need Help?

If you get stuck, check:
- Expo Docs: https://docs.expo.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Android SDK 35 requirements: https://developer.android.com/about/versions/15
