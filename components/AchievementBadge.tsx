import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AchievementDefinition } from '@/constants/achievements';

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: string;
}

export function AchievementBadge({ achievement, unlocked, unlockedAt }: AchievementBadgeProps) {
  return (
    <View style={[styles.badge, !unlocked && styles.badgeLocked]}>
      <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>{achievement.emoji}</Text>
      <Text style={[styles.title, !unlocked && styles.titleLocked]}>
        {achievement.title}
      </Text>
      <Text style={[styles.description, !unlocked && styles.descriptionLocked]}>
        {achievement.description}
      </Text>
      {unlocked && unlockedAt && (
        <Text style={styles.unlockedAt}>
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </Text>
      )}
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emojiLocked: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  titleLocked: {
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  descriptionLocked: {
    color: '#999',
  },
  unlockedAt: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 32,
  },
});

