# Missing Native Library: libreact_featureflagsjni.so

## Problem

The app crashes immediately on launch with:
```
com.facebook.soloader.SoLoaderDSONotFoundError: couldn't find DSO to load: libreact_featureflagsjni.so
```

This occurs when loading the New Architecture entry point in `MainApplication.onCreate()`.

## Root Cause

The native library `libreact_featureflagsjni.so` is not being built or packaged into the APK. This library is part of React Native's New Architecture and should be compiled during the native build process.

## Why This Happens

1. **Native build failure**: The native compilation step may have failed silently
2. **Missing build dependency**: The library might not be included as a dependency
3. **Packaging issue**: The library is built but not packaged into the APK
4. **Version mismatch**: React Native version incompatibility with Expo/New Architecture setup

## Solution Steps

### 1. Check EAS Build Logs

Review the EAS build logs for:
- CMake build errors
- Native compilation failures
- Missing dependency warnings
- React Native build errors

Look for lines containing:
- `libreact_featureflagsjni.so`
- `CMake Error`
- `native build`
- `react-native featureflags`

### 2. Verify React Native Version

Ensure React Native 0.81.5 is compatible with:
- Expo SDK 54
- New Architecture
- Your NDK version (26.1.10909125)

### 3. Clean and Rebuild

Try a completely clean rebuild:

```bash
# Clean everything
rm -rf android/app/build
rm -rf android/.gradle
rm -rf node_modules

# Reinstall
npm install

# Rebuild with EAS
eas build --profile development --platform android --clear-cache
```

### 4. Check Native Module Build

The library should be built as part of React Native's native modules. Verify in build logs that:
- All native modules are being compiled
- CMake configuration completes successfully
- No errors during native library linking

### 5. Verify New Architecture Configuration

Ensure these are correctly set:

**android/gradle.properties:**
```properties
newArchEnabled=true
```

**eas.json:**
```json
"EXPO_NEW_ARCH_ENABLED": "1"
```

**android/app/build.gradle:**
- New Architecture should be automatically enabled via `react-native-gradle-plugin`
- Check that `IS_NEW_ARCHITECTURE_ENABLED` is true in BuildConfig

### 6. Temporary Workaround (Not Recommended)

As a last resort, you could defer New Architecture loading, but this defeats the purpose:

```kotlin
// In MainApplication.kt - NOT RECOMMENDED
override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    try {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    } catch (e: SoLoaderDSONotFoundError) {
        Log.e("MainApplication", "Failed to load New Architecture", e)
        // This will cause issues with worklets/reanimated
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
}
```

## Expected Behavior

When working correctly:
1. Native build compiles all React Native native modules
2. `libreact_featureflagsjni.so` is created in build output
3. Library is packaged into APK in `lib/<abi>/`
4. SoLoader can find and load it at runtime

## Files to Check

- `android/app/build.gradle` - Native build configuration
- `android/gradle.properties` - New Architecture flags
- `eas.json` - Build profile configuration
- EAS build logs - Look for native build steps

## Next Steps

1. **Check EAS build logs** - This is the most important step
2. **Verify the build completed successfully** - Look for "BUILD SUCCESSFUL"
3. **Check for native build warnings** - Even warnings can indicate issues
4. **Try a clean rebuild** - Sometimes cached build artifacts cause issues

## Related Issues

This is similar to other missing native library issues:
- `libfbjni.so` not found
- `libreactnativejni.so` not found
- Other React Native native library errors

The fix is usually ensuring the native build completes successfully and all libraries are packaged.

