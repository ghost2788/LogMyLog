import { Poop, Stats, PoopType } from '@/types';

export function calculateDailyStats(poops: Poop[], today: Date = new Date()): Stats['daily'] {
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const todayPoops = poops.filter(p => {
    const poopDate = new Date(p.timestamp);
    return poopDate >= todayStart && poopDate <= todayEnd;
  });

  const lastPoop = todayPoops.length > 0 
    ? todayPoops[todayPoops.length - 1].timestamp 
    : (poops.length > 0 ? poops[0].timestamp : null);

  return {
    count: todayPoops.length,
    lastPoopTime: lastPoop,
  };
}

export function calculateWeeklyStats(poops: Poop[]): Stats['weekly'] {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekPoops = poops.filter(p => new Date(p.timestamp) >= weekAgo);
  
  const averagePerDay = weekPoops.length / 7;

  // Find most common type
  const typeCounts: Record<string, number> = {};
  weekPoops.forEach(p => {
    if (p.poop_type) {
      typeCounts[p.poop_type] = (typeCounts[p.poop_type] || 0) + 1;
    }
  });

  let mostCommonType: PoopType | null = null;
  let maxCount = 0;
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonType = type as PoopType;
    }
  });

  return {
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    mostCommonType,
  };
}

export function calculateMonthlyStats(poops: Poop[]): Stats['monthly'] {
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const monthPoops = poops.filter(p => new Date(p.timestamp) >= monthAgo);

  // Find most productive day
  const dayCounts: Record<string, number> = {};
  monthPoops.forEach(p => {
    const day = new Date(p.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  let mostProductiveDay: string | null = null;
  let maxCount = 0;
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostProductiveDay = day;
    }
  });

  return {
    totalCount: monthPoops.length,
    mostProductiveDay,
  };
}

export function calculateYearlyStats(poops: Poop[], longestStreak: number): Stats['yearly'] {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const yearPoops = poops.filter(p => new Date(p.timestamp) >= yearStart);

  return {
    totalCount: yearPoops.length,
    longestStreak,
  };
}

export function calculateAllStats(poops: Poop[], longestStreak: number): Stats {
  return {
    daily: calculateDailyStats(poops),
    weekly: calculateWeeklyStats(poops),
    monthly: calculateMonthlyStats(poops),
    yearly: calculateYearlyStats(poops, longestStreak),
  };
}

