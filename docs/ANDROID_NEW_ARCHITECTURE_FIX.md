# Android New Architecture Build Fix

## Problem

When building Android apps with React Native's New Architecture enabled, the build fails with a C++ compilation error:

```
error: no member named 'format' in namespace 'std'; did you mean 'folly::format'?
return std::format("{}%", dimension.value);
```

This occurs because:
1. React Native 0.81.5 uses `std::format` (C++20 feature) in `graphicsConversions.h`
2. `react-native-worklets` and `react-native-reanimated` require New Architecture to be enabled
3. Android NDK's libc++ doesn't fully support `std::format`, causing compilation failures
4. The error occurs in React Native prefab files cached by Gradle, not in source files

## Solution

A Gradle task that automatically patches the React Native prefab header files in Gradle's cache before compilation, replacing `std::format` with `snprintf` (which is compatible with Android NDK).

## Changes Made

### 1. Enable New Architecture

**File: `android/gradle.properties`**
```properties
newArchEnabled=true
```

**File: `eas.json`**
```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_NEW_ARCH_ENABLED": "1"
      }
    },
    "production": {
      "env": {
        "EXPO_NEW_ARCH_ENABLED": "1"
      }
    }
  }
}
```

### 2. Automatic Prefab Patching

**File: `android/app/build.gradle`**

Added a Gradle task and function that:
- Searches for `graphicsConversions.h` files in Gradle's cache prefab directories
- Replaces `std::format("{}%", dimension.value)` with `snprintf`-based implementation
- Runs automatically before CMake configuration tasks

The patching function:
```groovy
def patchPrefabFiles = {
    // Searches Gradle cache for prefab files
    // Patches std::format usage to use snprintf instead
}
```

The task runs via `doFirst` hooks on CMake tasks to ensure prefabs are patched right before compilation.

### 3. Source File Patching (Backup)

**File: `patches/react-native+0.81.5.patch`**

This patch exists and is applied by `patch-package` during `npm install`. However, it only patches source files in `node_modules`, not the prefab files in Gradle's cache, which is why the Gradle task is needed.

## Why This Works

1. **New Architecture Required**: `react-native-worklets` and `react-native-reanimated` now require New Architecture, so it must be enabled.

2. **Prefab Files**: React Native is distributed as prebuilt prefabs (pre-compiled libraries) that get cached by Gradle. The `std::format` issue is in these cached prefab headers.

3. **Timing**: The patching runs right before CMake configuration (via `doFirst` hooks), ensuring:
   - Prefab files are already extracted by Gradle
   - Files are patched before C++ compilation begins
   - Multiple hook points ensure patching happens regardless of task order

4. **snprintf Compatibility**: `snprintf` is fully supported by Android NDK and provides the same functionality as `std::format` for this use case.

## Verification

To verify the fix is working:

1. Check build logs for: `"Patching prefabs before configureCMake..."`
2. Look for: `"✓ Successfully patched: /path/to/graphicsConversions.h"`
3. Build should complete without `std::format` errors

## Future Maintenance

- **If upgrading React Native**: Check if the `std::format` issue still exists. If React Native fixes it in a newer version, this patching may no longer be needed.

- **If the patch stops working**: 
  - Verify the file path pattern still matches: `**/prefab/**/reactnative/**/graphicsConversions.h`
  - Check Gradle cache location hasn't changed
  - Ensure the `doFirst` hooks are still firing before CMake tasks

- **If you disable New Architecture**: You can remove the Gradle patching task, but note that `react-native-worklets` and `react-native-reanimated` require it.

## Files Modified

1. `android/gradle.properties` - Enabled `newArchEnabled=true`
2. `eas.json` - Set `EXPO_NEW_ARCH_ENABLED: "1"` in build profiles
3. `android/app/build.gradle` - Added `patchPrefabFiles` function and `doFirst` hooks
4. `patches/react-native+0.81.5.patch` - Source file patch (applied by patch-package)

## Alternative Solutions Considered

1. **Disable New Architecture**: Not possible - required by worklets/reanimated
2. **Patch only source files**: Doesn't work - prefabs in Gradle cache are used
3. **Use C++17 instead of C++20**: Not feasible - React Native requires C++20 for New Architecture
4. **Manual patching**: Too error-prone and doesn't survive cache clears

## Reference

- React Native Version: 0.81.5
- NDK Version: 26.1.10909125
- Gradle Version: 8.13
- Error Location: `graphicsConversions.h:80` in React Native prefab headers

