import { AchievementType } from '@/types';

export interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    type: 'The Regular',
    title: 'The Regular',
    description: '7 days in a row',
    emoji: '📅',
  },
  {
    type: 'Clockwork Colon',
    title: 'Clockwork Colon',
    description: 'Same time 3 days straight',
    emoji: '⏰',
  },
  {
    type: 'Iron Gut',
    title: 'Iron Gut',
    description: 'No missed days in a month',
    emoji: '💪',
  },
  {
    type: 'The Phantom',
    title: 'The Phantom',
    description: 'Missed 3 days',
    emoji: '👻',
  },
];

export function getAchievementDefinition(type: AchievementType): AchievementDefinition {
  return ACHIEVEMENTS.find(a => a.type === type) || ACHIEVEMENTS[0];
}

