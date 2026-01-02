import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePoopStore } from '@/store/poopStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useStatsStore } from '@/store/statsStore';

export default function RootLayout() {
  const fetchPoops = usePoopStore(state => state.fetchPoops);
  const fetchPreferences = usePreferencesStore(state => state.fetchPreferences);
  const recalculate = useStatsStore(state => state.recalculate);
  const poops = usePoopStore(state => state.poops);
  const preferences = usePreferencesStore(state => state.preferences);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Load initial data
    fetchPreferences().then(() => {
      fetchPoops();
    });
  }, []);

  useEffect(() => {
    // Recalculate stats when poops change
    if (poops.length > 0) {
      recalculate();
    }
  }, [poops]);

  useEffect(() => {
    // Handle navigation based on onboarding status
    if (!preferences) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'settings';
    
    if (!preferences.onboarding_completed && inAuthGroup) {
      router.replace('/onboarding');
    } else if (preferences.onboarding_completed && segments[0] === 'onboarding') {
      router.replace('/(tabs)');
    }
  }, [preferences, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

