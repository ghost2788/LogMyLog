import { supabase, getUserId } from './supabase';
import { Poop, UserPreferences, Achievement } from '@/types';

export async function createPoop(data: Partial<Poop>): Promise<Poop> {
  const userId = await getUserId();
  const { data: poop, error } = await supabase
    .from('poops')
    .insert({
      ...data,
      user_id: userId,
      timestamp: data.timestamp || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return poop;
}

export async function getPoops(filters?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<Poop[]> {
  const userId = await getUserId();
  let query = supabase
    .from('poops')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (filters?.startDate) {
    query = query.gte('timestamp', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('timestamp', filters.endDate);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function updatePoop(id: string, updates: Partial<Poop>): Promise<Poop> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('poops')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePoop(id: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase
    .from('poops')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences found, create default
      return await createDefaultPreferences();
    }
    throw error;
  }
  return data;
}

async function createDefaultPreferences(): Promise<UserPreferences> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      notification_enabled: false,
      notification_tone: 'Silly',
      notification_time: null,
      streak_grace_period_hours: 36,
      onboarding_completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    // If preferences don't exist, create them
    if (error.code === 'PGRST116') {
      return await createDefaultPreferences();
    }
    throw error;
  }
  return data;
}

export async function getAchievements(): Promise<Achievement[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function unlockAchievement(achievementType: Achievement['achievement_type']): Promise<Achievement> {
  const userId = await getUserId();
  
  // Check if already unlocked
  const { data: existing } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('achievement_type', achievementType)
    .single();

  if (existing) {
    return existing;
  }

  // Create new achievement
  const { data, error } = await supabase
    .from('achievements')
    .insert({
      user_id: userId,
      achievement_type: achievementType,
      unlocked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

