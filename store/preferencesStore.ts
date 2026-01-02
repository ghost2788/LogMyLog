import { create } from 'zustand';
import { UserPreferences, NotificationTone } from '@/types';
import * as database from '@/lib/database';
import { updateNotificationSchedule } from '@/utils/notifications';

interface PreferencesStore {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  setNotificationEnabled: (enabled: boolean) => Promise<void>;
  setNotificationTone: (tone: NotificationTone) => Promise<void>;
  setNotificationTime: (time: string | null) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: null,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const prefs = await database.getUserPreferences();
      set({ preferences: prefs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updatePreferences: async (updates) => {
    try {
      const updated = await database.updateUserPreferences(updates);
      set({ preferences: updated });
      
      // Update notification schedule if relevant
      if (updates.notification_time || updates.notification_tone !== undefined || updates.notification_enabled !== undefined) {
        const prefs = updated || get().preferences;
        if (prefs?.notification_enabled && prefs.notification_time) {
          await updateNotificationSchedule(prefs.notification_time, prefs.notification_tone);
        } else {
          await updateNotificationSchedule(null, 'Off');
        }
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setNotificationEnabled: async (enabled) => {
    await get().updatePreferences({ notification_enabled: enabled });
  },

  setNotificationTone: async (tone) => {
    await get().updatePreferences({ notification_tone: tone });
  },

  setNotificationTime: async (time) => {
    await get().updatePreferences({ notification_time: time });
  },
}));

