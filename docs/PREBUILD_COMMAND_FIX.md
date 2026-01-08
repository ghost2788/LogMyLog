# Prebuild Command Error Fix

## Problem

EAS builds were failing with the error:
```
unknown or unexpected option: --platform
npx expo node scripts/prebuild.js --platform android exited with non-zero code: 1
```

Or:
```
Cannot get Expo config from an Expo project
```

## Root Cause

The project has **native folders already present** (`android/` and `ios/`). When native folders exist:

1. **EAS automatically handles prebuild** - No custom `prebuildCommand` is needed
2. **EAS appends `--platform` flag** - When a `prebuildCommand` is specified, EAS automatically appends `--platform android` or `--platform ios` to the command
3. **Custom scripts don't need the flag** - If your script only runs `postinstall` (to apply patches), it doesn't need to handle the `--platform` argument
4. **Running `expo prebuild` manually causes conflicts** - Trying to run `expo prebuild` in a script when EAS will also run it causes config loading errors

## Solution

**Remove `prebuildCommand` from `eas.json` entirely.**

### Why This Works

1. **`postinstall` runs automatically** - The `postinstall` script in `package.json` runs automatically after `npm install` during the EAS build process
2. **EAS handles prebuild** - When native folders exist, EAS automatically runs prebuild without needing a custom command
3. **No argument parsing needed** - Without a custom command, there's no need to handle the `--platform` flag

### Configuration

**File: `package.json`**
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

**File: `eas.json`**
```json
{
  "build": {
    "development": {
      // NO prebuildCommand needed
      "env": {
        "EXPO_UNSTABLE_CORE_AUTOLINKING": "1",
        "EXPO_NO_DOTENV": "1",
        "EXPO_NEW_ARCH_ENABLED": "1"
      }
    }
  }
}
```

## When You DO Need a prebuildCommand

Only use `prebuildCommand` if you need to:
- Run custom setup steps BEFORE prebuild
- Apply patches that must happen after `npm install` but before prebuild
- Run platform-specific setup that can't be done in `postinstall`

**If you must use `prebuildCommand`:**
- Make sure your script ignores the `--platform` argument (don't try to parse it)
- Don't run `expo prebuild` in your script - let EAS handle it
- Only use it for setup tasks, not for the actual prebuild step

## Example: If You Need a Custom prebuildCommand

```javascript
// scripts/prebuild.js
#!/usr/bin/env node
const { execSync } = require('child_process');

// Ignore all arguments (including --platform)
// EAS will handle prebuild automatically

// Only run your custom setup here
execSync('npm run postinstall', { stdio: 'inherit' });
// Don't run expo prebuild - EAS does that automatically
```

## Verification

The `preview` profile in `eas.json` doesn't have a `prebuildCommand` and works correctly. All profiles should follow this pattern when native folders already exist.

## Key Takeaways

1. **Native folders exist = No prebuildCommand needed**
2. **EAS automatically runs prebuild when native folders are present**
3. **`postinstall` runs automatically via npm lifecycle hooks**
4. **Don't try to run `expo prebuild` manually in scripts when EAS will do it**
5. **If you must use prebuildCommand, ignore the `--platform` argument**

## Related Files

- `eas.json` - Build configuration (should NOT have prebuildCommand for projects with native folders)
- `package.json` - Contains `postinstall` script that runs automatically
- `scripts/prebuild.js` - Only needed if you have custom setup requirements

