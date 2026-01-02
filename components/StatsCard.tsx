import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  label: string;
  value: string | number;
  emoji?: string;
}

export function StatsCard({ label, value, emoji }: StatsCardProps) {
  return (
    <View style={styles.card}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

