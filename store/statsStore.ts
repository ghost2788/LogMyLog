import { create } from 'zustand';
import { Stats, StreakData } from '@/types';
import { calculateAllStats } from '@/lib/stats';
import { calculateStreaks } from '@/lib/streaks';
import { usePoopStore } from './poopStore';
import { usePreferencesStore } from './preferencesStore';

interface StatsStore {
  stats: Stats | null;
  streaks: StreakData;
  isLoading: boolean;
  recalculate: () => void;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: null,
  streaks: {
    current: 0,
    longest: 0,
    lastPoopDate: null,
  },
  isLoading: false,

  recalculate: () => {
    const poops = usePoopStore.getState().poops;
    const preferences = usePreferencesStore.getState().preferences;
    const gracePeriod = preferences?.streak_grace_period_hours || 36;

    const streaks = calculateStreaks(poops, gracePeriod);
    const stats = calculateAllStats(poops, streaks.longest);

    set({ stats, streaks });
  },
}));

