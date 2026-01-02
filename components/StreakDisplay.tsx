import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StreakDisplayProps {
  current: number;
  longest: number;
}

export function StreakDisplay({ current, longest }: StreakDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.streakNumber}>{current}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.streakBox}>
        <Text style={styles.emoji}>⭐</Text>
        <Text style={styles.streakNumber}>{longest}</Text>
        <Text style={styles.streakLabel}>Longest</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakBox: {
    flex: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});

