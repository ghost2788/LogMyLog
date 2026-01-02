import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import AsyncStorage from '@react-native-async-storage/async-storage';

// Get or create anonymous user ID (device-based)
export async function getUserId(): Promise<string> {
  // For MVP, use a simple device-based identifier
  // In production, you might want to use Expo's SecureStore or similar
  let userId = await AsyncStorage.getItem('device_user_id');
  
  if (!userId) {
    userId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem('device_user_id', userId);
  }
  
  return userId;
}

