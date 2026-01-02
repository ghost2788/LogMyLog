import { Poop, StreakData } from '@/types';

export function calculateStreaks(
  poops: Poop[],
  gracePeriodHours: number = 36
): StreakData {
  if (poops.length === 0) {
    return {
      current: 0,
      longest: 0,
      lastPoopDate: null,
    };
  }

  // Sort poops by timestamp (newest first)
  const sortedPoops = [...poops].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const lastPoopDate = sortedPoops[0].timestamp;

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(sortedPoops, gracePeriodHours);
  
  // Calculate longest streak
  const longestStreak = calculateLongestStreak(sortedPoops);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastPoopDate,
  };
}

function calculateCurrentStreak(poops: Poop[], gracePeriodHours: number): number {
  if (poops.length === 0) return 0;

  // Get unique days with poops
  const uniqueDays = new Set<string>();
  poops.forEach(p => {
    const date = new Date(p.timestamp);
    date.setHours(0, 0, 0, 0);
    uniqueDays.add(date.toISOString());
  });

  const daysArray = Array.from(uniqueDays)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  if (daysArray.length === 0) return 0;

  // Start from today or the most recent poop day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentDate = daysArray[0];
  let streak = 0;
  let dayIndex = 0;

  // Check if we should start from today or most recent day
  const hoursSinceLastPoop = (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastPoop <= gracePeriodHours) {
    // Count the most recent day
    streak = 1;
    
    // Now count backwards
    for (let i = 1; i < daysArray.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      const nextPoopDate = new Date(daysArray[i]);
      nextPoopDate.setHours(0, 0, 0, 0);
      
      const dayDiff = (currentDate.getTime() - nextPoopDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff <= 1 + (gracePeriodHours / 24)) {
        streak++;
        currentDate = nextPoopDate;
      } else {
        break;
      }
    }
  }

  return streak;
}

function calculateLongestStreak(poops: Poop[]): number {
  if (poops.length === 0) return 0;

  // Get unique days with poops
  const uniqueDays = new Set<string>();
  poops.forEach(p => {
    const date = new Date(p.timestamp);
    date.setHours(0, 0, 0, 0);
    uniqueDays.add(date.toISOString());
  });

  const daysArray = Array.from(uniqueDays)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  if (daysArray.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < daysArray.length; i++) {
    const prevDate = new Date(daysArray[i - 1]);
    const currDate = new Date(daysArray[i]);
    
    const dayDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

