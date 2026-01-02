# LogMyLog - Poop Tracking App MVP

A playful, low-friction mobile app for logging poops with optional tags, stats, streaks, and achievements.

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Supabase** - Backend database
- **Expo Router** - File-based navigation
- **Expo Notifications** - Daily reminders

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
3. Get your Supabase URL and anon key from the project settings

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Alternatively, you can configure these in `app.json` under `extra`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

### 4. Run the App

```bash
npm start
```

Then press `i` for iOS or `a` for Android.

## Project Structure

```
LogMyLog/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator screens
│   ├── onboarding.tsx     # Onboarding flow
│   ├── settings.tsx       # Settings screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── lib/                   # Core utilities
│   ├── supabase.ts       # Supabase client
│   ├── database.ts       # Database operations
│   ├── stats.ts          # Stats calculations
│   ├── streaks.ts        # Streak logic
│   └── achievements.ts   # Achievement checking
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── constants/             # Constants and config
└── utils/                 # Utility functions
```

## Features

- **One-Tap Logging** - Log poops instantly with a single tap
- **Optional Tags** - Add type, feeling, time, and location (all optional)
- **Stats Tracking** - Daily, weekly, monthly, and yearly statistics
- **Streaks** - Track consecutive days with configurable grace period
- **Achievements** - Unlock achievements for various milestones
- **Notifications** - Daily reminders with customizable tone

## Database Schema

See `supabase/schema.sql` for the complete database schema.

## Privacy

All data is stored securely in Supabase with Row Level Security (RLS) enabled. Users can only access their own data.

## License

Private project

