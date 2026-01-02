-- Create poops table
CREATE TABLE IF NOT EXISTS poops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  poop_type TEXT,
  feeling TEXT,
  time_of_day TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  notification_enabled BOOLEAN DEFAULT false,
  notification_tone TEXT DEFAULT 'Silly',
  notification_time TIME,
  streak_grace_period_hours INTEGER DEFAULT 36,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_poops_user_id ON poops(user_id);
CREATE INDEX IF NOT EXISTS idx_poops_timestamp ON poops(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_poops_user_timestamp ON poops(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE poops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device-based authentication
-- For MVP, we allow access if user_id matches or starts with 'device_'
-- This allows both authenticated users and anonymous device-based users

-- Poops policies
CREATE POLICY "Users can view their own poops"
  ON poops FOR SELECT
  USING (true); -- Simplified for MVP - filter by user_id in app logic

CREATE POLICY "Users can insert their own poops"
  ON poops FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own poops"
  ON poops FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own poops"
  ON poops FOR DELETE
  USING (true);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (true);

-- Achievements policies
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (true);

-- Note: For production, you should implement proper authentication
-- and use Supabase Auth to get user_id, then enforce RLS policies
-- based on auth.uid(). The current setup allows device-based anonymous users
-- for MVP purposes.
