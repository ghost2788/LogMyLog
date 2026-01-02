# Next Steps to Run Your App

## ✅ Completed
- [x] Project initialized
- [x] Dependencies installed
- [x] Code structure created

## 🔧 Required Setup Steps

### 1. Set Up Supabase (5-10 minutes)

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Sign up/login and create a new project
   - Wait for project to be provisioned (~2 minutes)

2. **Run Database Schema:**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **New Query**
   - Copy and paste the contents of `supabase/schema.sql`
   - Click **Run** (or press Ctrl/Cmd + Enter)
   - Verify all tables are created (check Table Editor)

3. **Get API Credentials:**
   - Go to **Project Settings** → **API**
   - Copy your **Project URL**
   - Copy your **anon public** key (not the service_role key!)

4. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

### 2. Create App Assets (Optional for Development)

The app needs image assets, but you can test without them:

**Quick Option:** Create simple placeholder images:
- `assets/icon.png` - Any 1024x1024 image
- `assets/splash.png` - Any 1242x2436 image  
- `assets/adaptive-icon.png` - Any 1024x1024 image
- `assets/favicon.png` - Any 48x48 image
- `assets/notification-icon.png` - Any 96x96 image

Or use an online tool like [AppIcon.co](https://www.appicon.co/) to generate them all from one image.

**Note:** The app will run even with missing assets, but Expo will show warnings.

### 3. Run the App

```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator  
- Scan QR code with Expo Go app on your phone

## 🧪 Testing Checklist

Once the app is running:

- [ ] Onboarding screen appears on first launch
- [ ] Can log a poop (tap "I Pooped" button)
- [ ] Quick tags modal appears
- [ ] Stats update after logging
- [ ] Streak counter works
- [ ] Can navigate between tabs
- [ ] Settings screen accessible
- [ ] Achievements screen shows available achievements

## 🔍 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists with correct values
- Restart Expo: `npm start -c` (clear cache)

### "Table does not exist" errors
- Run the SQL schema in Supabase SQL Editor
- Check that all tables exist in Table Editor

### App crashes on startup
- Check terminal for error messages
- Ensure all dependencies are installed: `npm install`
- Try clearing cache: `npx expo start -c`

### Notifications not working
- On iOS: Requires physical device (simulator doesn't support notifications)
- Grant permissions when prompted
- Check device notification settings

## 📱 What to Test

1. **First Launch:**
   - Should show onboarding
   - Request notification permissions

2. **Logging Flow:**
   - Tap "I Pooped" → Should log instantly
   - Modal appears with tag options
   - Skip or add tags
   - Stats should update

3. **Stats:**
   - Check daily count
   - Check streak counter
   - View detailed stats in Stats tab

4. **Achievements:**
   - Log 7 poops over 7 days → Unlock "The Regular"
   - Check achievements screen

5. **Settings:**
   - Enable notifications
   - Change notification tone
   - Verify preferences save

## 🚀 After Testing

Once everything works:
- Replace placeholder assets with final designs
- Test on physical devices
- Consider adding more polish/animations
- Prepare for app store submission (if desired)

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Check `README.md` for project overview
- Supabase docs: https://supabase.com/docs

