import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ACHIEVEMENTS } from '@/constants/achievements';
import { usePoopStore } from '@/store/poopStore';
import * as database from '@/lib/database';
import { Achievement } from '@/types';

export default function AchievementsScreen() {
  const [unlockedAchievements, setUnlockedAchievements] = React.useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const achievements = await database.getAchievements();
      setUnlockedAchievements(achievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const isUnlocked = (type: Achievement['achievement_type']) => {
    return unlockedAchievements.some(a => a.achievement_type === type);
  };

  const getUnlockedAt = (type: Achievement['achievement_type']) => {
    return unlockedAchievements.find(a => a.achievement_type === type)?.unlocked_at;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Achievements</Text>
      
      {ACHIEVEMENTS.map(achievement => (
        <AchievementBadge
          key={achievement.type}
          achievement={achievement}
          unlocked={isUnlocked(achievement.type)}
          unlockedAt={getUnlockedAt(achievement.type)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    paddingTop: 16,
  },
});

