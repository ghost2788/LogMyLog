# Onboarding Setup Guide

## Database Migration

Before testing the onboarding flow, you need to apply the database migration:

```bash
# If using Supabase CLI locally
supabase migration up

# Or apply manually in Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Run the contents of: supabase/migrations/add_user_profile_fields.sql
```

The migration adds:
- `username` (TEXT UNIQUE) to `user_preferences`
- `birthday` (DATE) to `user_preferences`
- Index on `username` for faster lookups

## Supabase Auth Configuration

### Phone Authentication Setup

1. **Enable Phone Auth in Supabase Dashboard:**
   - Go to Authentication → Providers
   - Enable "Phone" provider
   - Configure SMS provider (Twilio recommended for production)

2. **For Development/Testing:**
   - Supabase provides a test phone number: `+14155238886`
   - Test code: `123456` (works in development mode)
   - Or use your own phone number with a real SMS provider

3. **Phone Number Format:**
   - Currently configured for US numbers (+1)
   - Format: `(XXX) XXX-XXXX`
   - Stored as: `+1XXXXXXXXXX` in Supabase Auth

### OAuth Configuration

Discord OAuth should already be configured. Make sure:
- Redirect URL: `logmylog://auth/callback` is in Supabase → Authentication → URL Configuration

## Testing the Onboarding Flow

### Option 1: Phone Signup (New User)
1. Open the app
2. Tap "Sign up with Phone"
3. Go through all 6 steps:
   - **Step 1:** Permissions - Grant notification permissions
   - **Step 2:** Phone - Enter phone number, verify SMS code
   - **Step 3:** Birthday - Select birthday (must be 18+)
   - **Step 4:** Username - Choose a unique username
   - **Step 5:** Password - Create a password
   - **Step 6:** Terms - Agree to terms
4. Should redirect to home screen after completion

### Option 2: Discord Login (Existing User)
1. Open the app
2. Tap "Sign in with Discord"
3. Complete Discord OAuth
4. If `onboarding_completed = false` in database, will redirect to onboarding
5. Complete onboarding steps
6. Should redirect to home screen

## Development Build

```bash
# Start Expo dev server
npm start

# Or run on specific platform
npm run android
npm run ios
```

## Troubleshooting

### Phone Verification Not Working
- Check Supabase Dashboard → Authentication → Providers → Phone is enabled
- Verify SMS provider is configured (Twilio, etc.)
- For testing, use Supabase test number: `+14155238886` with code `123456`

### Username Already Taken
- The app checks username availability in real-time
- Suggestions are provided if username is taken
- Username must be 3-20 characters, alphanumeric + underscores only

### Onboarding Loop
- Check `user_preferences.onboarding_completed` in database
- Should be `true` after completing Step 6
- If stuck, manually set to `true` in database

### Navigation Issues
- Make sure `app/onboarding/_layout.tsx` exists
- Check that onboarding route is in `app/_layout.tsx` Stack
- Verify `onboarding_completed` check in `app/_layout.tsx`

## Database Schema

After migration, `user_preferences` table includes:
- `username` TEXT UNIQUE (nullable)
- `birthday` DATE (nullable)
- `onboarding_completed` BOOLEAN (default: false)

## Notes

- Phone numbers are stored in Supabase Auth (`auth.users.phone`)
- Username and birthday are stored in `user_preferences` table
- Password is managed by Supabase Auth
- Age verification (18+) is enforced in birthday step
- All onboarding data is saved progressively as user completes each step

