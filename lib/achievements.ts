import { Poop, AchievementType } from '@/types';
import { calculateStreaks } from './streaks';

export async function checkAchievements(
  poops: Poop[],
  gracePeriodHours: number,
  existingAchievements: string[]
): Promise<AchievementType[]> {
  const newAchievements: AchievementType[] = [];

  // Check "The Regular" - 7 days in a row
  if (!existingAchievements.includes('The Regular')) {
    const { current } = calculateStreaks(poops, gracePeriodHours);
    if (current >= 7) {
      newAchievements.push('The Regular');
    }
  }

  // Check "Iron Gut" - No missed days in a month
  if (!existingAchievements.includes('Iron Gut')) {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const monthPoops = poops.filter(p => new Date(p.timestamp) >= monthAgo);
    const uniqueDays = new Set<string>();
    monthPoops.forEach(p => {
      const date = new Date(p.timestamp);
      date.setHours(0, 0, 0, 0);
      uniqueDays.add(date.toISOString());
    });

    const daysInMonth = Math.floor((now.getTime() - monthAgo.getTime()) / (1000 * 60 * 60 * 24));
    if (uniqueDays.size === daysInMonth) {
      newAchievements.push('Iron Gut');
    }
  }

  // Check "Clockwork Colon" - Same time 3 days straight
  if (!existingAchievements.includes('Clockwork Colon')) {
    const recentPoops = poops
      .filter(p => {
        const daysAgo = (Date.now() - new Date(p.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 3;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (recentPoops.length >= 3) {
      // Group by day and check if same hour range
      const days: Record<string, number[]> = {};
      recentPoops.forEach(p => {
        const date = new Date(p.timestamp);
        const dayKey = date.toLocaleDateString();
        const hour = date.getHours();
        if (!days[dayKey]) days[dayKey] = [];
        days[dayKey].push(hour);
      });

      const dayKeys = Object.keys(days).sort().reverse().slice(0, 3);
      if (dayKeys.length === 3) {
        const hours = dayKeys.map(day => {
          const hoursForDay = days[day];
          return Math.round(hoursForDay.reduce((a, b) => a + b, 0) / hoursForDay.length);
        });

        // Check if hours are similar (within 1 hour)
        const allSimilar = hours.every((h, i) => 
          i === 0 || Math.abs(h - hours[i - 1]) <= 1
        );

        if (allSimilar) {
          newAchievements.push('Clockwork Colon');
        }
      }
    }
  }

  // Check "The Phantom" - Missed 3 days (this is a funny achievement, not shaming)
  // Note: We skip this check for now as it requires understanding "missed" days
  // which is complex. Can be implemented later with more sophisticated logic.

  return newAchievements;
}

