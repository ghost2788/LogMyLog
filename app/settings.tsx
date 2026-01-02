import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePreferencesStore } from '@/store/preferencesStore';
import { NotificationTone } from '@/types';
import { requestNotificationPermissions } from '@/utils/notifications';

export default function SettingsScreen() {
  const router = useRouter();
  const preferences = usePreferencesStore(state => state.preferences);
  const fetchPreferences = usePreferencesStore(state => state.fetchPreferences);
  const updatePreferences = usePreferencesStore(state => state.updatePreferences);
  const [notificationTime, setNotificationTime] = useState('09:00');

  useEffect(() => {
    fetchPreferences();
    if (preferences?.notification_time) {
      setNotificationTime(preferences.notification_time);
    }
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive reminders.'
        );
        return;
      }
    }
    await updatePreferences({ notification_enabled: enabled });
  };

  const handleToneChange = (tone: NotificationTone) => {
    updatePreferences({ notification_tone: tone });
  };

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    updatePreferences({ notification_time: time });
  };

  const tones: NotificationTone[] = ['Silly', 'Neutral', 'Off'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Reminders</Text>
            <Text style={styles.settingDescription}>
              Get daily reminders to log your poops
            </Text>
          </View>
          <Switch
            value={preferences?.notification_enabled || false}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#E0E0E0', true: '#8B4513' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {preferences?.notification_enabled && (
          <>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Tone</Text>
              <View style={styles.toneButtons}>
                {tones.map(tone => (
                  <TouchableOpacity
                    key={tone}
                    style={[
                      styles.toneButton,
                      preferences?.notification_tone === tone && styles.toneButtonSelected,
                    ]}
                    onPress={() => handleToneChange(tone)}
                  >
                    <Text
                      style={[
                        styles.toneButtonText,
                        preferences?.notification_tone === tone && styles.toneButtonTextSelected,
                      ]}
                    >
                      {tone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Time</Text>
              <View style={styles.timeInput}>
                <Text style={styles.timeText}>{notificationTime}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.privacyText}>
          Your poop data is stored securely and privately.{'\n'}
          No social features. No data sharing.{'\n'}
          Just you and your logs.
        </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 24,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  toneButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  toneButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toneButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#8B4513',
  },
  toneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toneButtonTextSelected: {
    color: '#8B4513',
  },
  timeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

