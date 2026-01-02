import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { requestNotificationPermissions } from '@/utils/notifications';
import { usePreferencesStore } from '@/store/preferencesStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const updatePreferences = usePreferencesStore(state => state.updatePreferences);

  const handleContinue = async () => {
    setLoading(true);
    
    // Request notification permissions
    const granted = await requestNotificationPermissions();
    
    // Mark onboarding as complete
    await updatePreferences({
      onboarding_completed: true,
      notification_enabled: granted,
    });

    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💩</Text>
      <Text style={styles.title}>Welcome to LogMyLog</Text>
      <Text style={styles.subtitle}>
        This app tracks your poops.{'\n'}That's it.
      </Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Setting up...' : 'Get Started'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.privacy}>
        Your poop data is yours.{'\n'}We don't want it.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    minWidth: 200,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacy: {
    marginTop: 48,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

