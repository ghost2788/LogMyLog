import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PoopButton } from '@/components/PoopButton';
import { QuickTagsModal } from '@/components/QuickTagsModal';
import { StatsCard } from '@/components/StatsCard';
import { StreakDisplay } from '@/components/StreakDisplay';
import { usePoopStore } from '@/store/poopStore';
import { useStatsStore } from '@/store/statsStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { checkAchievements } from '@/lib/achievements';
import * as database from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { Poop, PoopType, Feeling, TimeOfDay, Location } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPoopId, setCurrentPoopId] = useState<string | null>(null);
  
  const addPoop = usePoopStore(state => state.addPoop);
  const updatePoop = usePoopStore(state => state.updatePoop);
  const poops = usePoopStore(state => state.poops);
  const stats = useStatsStore(state => state.stats);
  const streaks = useStatsStore(state => state.streaks);
  const preferences = usePreferencesStore(state => state.preferences);
  const recalculate = useStatsStore(state => state.recalculate);


  const handlePoopPress = async () => {
    try {
      const newPoop = await addPoop({
        timestamp: new Date().toISOString(),
      });
      
      setCurrentPoopId(newPoop.id);
      setModalVisible(true);
      
      // Check for achievements
      const gracePeriod = preferences?.streak_grace_period_hours || 36;
      const existingAchievementsData = await database.getAchievements();
      const existingAchievementTypes = existingAchievementsData.map(a => a.achievement_type);
      
      const newAchievements = await checkAchievements(
        [...poops, newPoop],
        gracePeriod,
        existingAchievementTypes
      );
      
      if (newAchievements.length > 0) {
        // Unlock achievements
        for (const achievementType of newAchievements) {
          await database.unlockAchievement(achievementType);
        }
      }
      
      recalculate();
    } catch (error) {
      console.error('Error logging poop:', error);
    }
  };

  const handleSaveTags = async (tags: {
    poop_type: PoopType | null;
    feeling: Feeling | null;
    time_of_day: TimeOfDay | null;
    location: Location | null;
  }) => {
    if (currentPoopId) {
      await updatePoop(currentPoopId, tags);
      recalculate();
    }
    setCurrentPoopId(null);
  };

  const formatLastPoopTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const currentPoop = currentPoopId 
    ? poops.find(p => p.id === currentPoopId) 
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LogMyLog</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainSection}>
        <PoopButton onPress={handlePoopPress} />
      </View>

      {stats && (
        <View style={styles.statsSection}>
          <View style={styles.dailyStats}>
            <StatsCard
              label="Today"
              value={stats.daily.count}
              emoji="📊"
            />
            <StatsCard
              label="Last Poop"
              value={formatLastPoopTime(stats.daily.lastPoopTime)}
              emoji="🕐"
            />
          </View>

          <StreakDisplay current={streaks.current} longest={streaks.longest} />
        </View>
      )}

      <QuickTagsModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCurrentPoopId(null);
        }}
        onSave={handleSaveTags}
        initialTags={currentPoop || undefined}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  mainSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  statsSection: {
    gap: 16,
  },
  dailyStats: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
});

