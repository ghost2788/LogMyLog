import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatsCard } from '@/components/StatsCard';
import { useStatsStore } from '@/store/statsStore';
import { usePoopStore } from '@/store/poopStore';

export default function StatsScreen() {
  const stats = useStatsStore(state => state.stats);
  const poops = usePoopStore(state => state.poops);

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No stats yet. Log your first poop!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Stats</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily</Text>
        <View style={styles.cardRow}>
          <StatsCard label="Today" value={stats.daily.count} emoji="📊" />
          <StatsCard 
            label="Total Logs" 
            value={poops.length} 
            emoji="💩" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly</Text>
        <View style={styles.cardRow}>
          <StatsCard 
            label="Avg/Day" 
            value={stats.weekly.averagePerDay} 
            emoji="📈" 
          />
          <StatsCard 
            label="Most Common" 
            value={stats.weekly.mostCommonType || 'N/A'} 
            emoji="🏆" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly</Text>
        <View style={styles.cardRow}>
          <StatsCard 
            label="This Month" 
            value={stats.monthly.totalCount} 
            emoji="📅" 
          />
          <StatsCard 
            label="Best Day" 
            value={stats.monthly.mostProductiveDay || 'N/A'} 
            emoji="⭐" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yearly</Text>
        <View style={styles.cardRow}>
          <StatsCard 
            label="This Year" 
            value={stats.yearly.totalCount} 
            emoji="📊" 
          />
          <StatsCard 
            label="Longest Streak" 
            value={stats.yearly.longestStreak} 
            emoji="🔥" 
          />
        </View>
      </View>
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
    marginBottom: 32,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 48,
  },
});

