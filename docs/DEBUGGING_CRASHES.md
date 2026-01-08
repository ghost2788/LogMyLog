# Debugging App Crashes on Android

## Quick Crash Log Capture

### Method 1: Capture Logs After Crash

1. **Clear old logs and start monitoring:**
   ```powershell
   adb logcat -c
   adb logcat *:E ReactNative:V ReactNativeJS:V AndroidRuntime:E > crash_log.txt
   ```

2. **Launch the app** on your device/emulator

3. **Wait for it to crash**, then press `Ctrl+C` to stop logcat

4. **Check the last 50 lines** for the error:
   ```powershell
   Get-Content crash_log.txt -Tail 50
   ```

### Method 2: Get Just the Fatal Exception

```powershell
adb logcat -d | Select-String -Pattern "FATAL|AndroidRuntime|Exception" -Context 5,10
```

### Method 3: Filter for React Native Errors Only

```powershell
adb logcat -d ReactNativeJS:E ReactNative:E AndroidRuntime:E
```

## Common Crash Causes to Check

### 1. JavaScript Errors
Look for:
- `ReactNativeJS: Error: ...`
- `com.facebook.react.bridge.JavaScriptException`
- Stack traces starting with JavaScript file names

### 2. Native Module Errors
Look for:
- `java.lang.UnsatisfiedLinkError` - Native module not found
- `java.lang.NoSuchMethodError` - Method signature mismatch
- Errors mentioning specific modules like `reanimated`, `worklets`, `adapty`

### 3. Initialization Errors
Look for:
- Errors in `MainApplication.onCreate`
- Errors loading native libraries (SoLoader)
- New Architecture initialization failures

### 4. Missing Imports/Dependencies
Look for:
- `Error: Cannot find module ...`
- Import resolution errors

## Using React Native DevTools

### Install React Native DevTools

```bash
npm install --save-dev @react-native-community/cli-debugger-ui
```

Or use the standalone app:
- Download from: https://github.com/react-native-debugger/react-native-debugger/releases

### Enable Remote JS Debugging

1. Shake device or press `Ctrl+M` (Android emulator)
2. Select "Debug"
3. Chrome DevTools will open at `http://localhost:8081/debugger-ui`

### Check Console for Errors

- Open Chrome DevTools Console
- Look for red error messages
- Check the Network tab for failed requests

## Using Flipper (Advanced)

Flipper provides comprehensive debugging for React Native:

1. **Install Flipper:**
   - Download from: https://fbflipper.com/
   - Install React Native plugins in Flipper

2. **Enable Flipper in app:**
   - Already enabled in development builds
   - Open Flipper desktop app
   - Connect device/emulator
   - View logs, network requests, layout inspector

## Hermes Debugging

With Hermes enabled (default in new architecture):

### View Hermes Console Logs
```powershell
adb logcat -s ReactNativeJS:V
```

### Enable Hermes Inspector
- Same as React Native DevTools
- Shake device → "Debug" → Opens Chrome DevTools

### Check Hermes Stack Traces
- Hermes provides better stack traces than JSC
- Look for file names and line numbers in crash logs

## Quick Checks Before Deep Debugging

1. **Verify Babel config is correct:**
   - `babel.config.js` has `react-native-reanimated/plugin` (must be last)
   - `babel.config.js` has `react-native-worklets/plugin`

2. **Clear all caches:**
   ```bash
   npm start -- --reset-cache
   rm -rf node_modules/.cache
   ```

3. **Verify New Architecture is enabled:**
   - Check `android/gradle.properties` has `newArchEnabled=true`
   - Check `eas.json` has `EXPO_NEW_ARCH_ENABLED: "1"`

4. **Check for syntax errors:**
   ```bash
   npx tsc --noEmit
   ```

## Getting Specific Error Context

Once you have the crash log, look for:

1. **The exception type** (first line of stack trace)
2. **The file/line number** where it crashed
3. **Any "Caused by" sections** (root cause)
4. **React Native bridge errors** (JS → Native communication issues)

## Share Crash Log

When asking for help, include:
- Last 100 lines of crash log
- The specific exception message
- When it crashes (on launch, after login, etc.)
- Device/emulator details

