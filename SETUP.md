# Setup Guide

## Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Wait for your project to be provisioned
3. Go to the SQL Editor in your Supabase dashboard
4. Copy and paste the contents of `supabase/schema.sql` into the editor
5. Run the SQL script
6. Go to Project Settings > API
7. Copy your:
   - Project URL
   - `anon` `public` API key

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Or configure in `app.json` under the `extra` section:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-id.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    }
  }
}
```

## Step 4: Create Assets (Optional)

The app expects these assets in the `assets/` directory:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
- `notification-icon.png` (96x96)

You can use placeholder images for now or generate them using tools like:
- [App Icon Generator](https://www.appicon.co/)
- [Expo Asset Generator](https://github.com/expo/expo-cli/tree/main/packages/asset-generator)

## Step 5: Run the App

```bash
npm start
```

Then:
- Press `i` to run on iOS Simulator
- Press `a` to run on Android Emulator
- Scan the QR code with Expo Go app on your physical device

## Troubleshooting

### Supabase Connection Issues

- Make sure your Supabase project is active
- Verify your URL and API key are correct
- Check that the SQL schema was executed successfully
- Ensure RLS policies are set up (they should be created by the schema)

### Notification Issues

- On iOS, notifications require a physical device (simulator doesn't support notifications)
- Make sure you grant notification permissions when prompted

### TypeScript Errors

- Run `npx expo install --fix` to ensure all Expo packages are compatible
- Clear cache: `npx expo start -c`

## Next Steps

1. Test the onboarding flow
2. Log your first poop
3. Test the stats and achievements
4. Configure notifications in settings

## Notes

- For MVP, the app uses device-based anonymous authentication
- All data is stored in Supabase with Row Level Security
- The app works offline but requires internet for syncing data

