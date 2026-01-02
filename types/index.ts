export type PoopType = 'Rock Solid' | 'Normal Hero' | 'Soft Serve' | 'Danger Zone';
export type Feeling = 'Relieved' | 'Neutral' | 'Regret' | 'Rushed' | 'Victorious';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Night';
export type Location = 'Home' | 'Work' | 'Public' | 'Unknown';
export type NotificationTone = 'Silly' | 'Neutral' | 'Off';

export interface Poop {
  id: string;
  user_id: string;
  timestamp: string;
  poop_type: PoopType | null;
  feeling: Feeling | null;
  time_of_day: TimeOfDay | null;
  location: Location | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  notification_enabled: boolean;
  notification_tone: NotificationTone;
  notification_time: string | null;
  streak_grace_period_hours: number;
  onboarding_completed: boolean;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  unlocked_at: string;
}

export type AchievementType = 'The Regular' | 'Clockwork Colon' | 'Iron Gut' | 'The Phantom';

export interface Stats {
  daily: {
    count: number;
    lastPoopTime: string | null;
  };
  weekly: {
    averagePerDay: number;
    mostCommonType: PoopType | null;
  };
  monthly: {
    totalCount: number;
    mostProductiveDay: string | null;
  };
  yearly: {
    totalCount: number;
    longestStreak: number;
  };
}

export interface StreakData {
  current: number;
  longest: number;
  lastPoopDate: string | null;
}

