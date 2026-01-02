import * as Notifications from 'expo-notifications';
import { NotificationTone } from '@/types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SILLY_MESSAGES = [
  "Hey... did you poop today?",
  "Friendly reminder from your colon.",
  "Logs > clogs.",
  "Time to log your daily deposit!",
  "Your colon called, it wants an update.",
];

const NEUTRAL_MESSAGES = [
  "Daily log reminder.",
  "Don't forget to track today.",
  "Time for your daily log.",
  "Remember to log your entry.",
];

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function scheduleDailyNotification(
  time: string,
  tone: NotificationTone
): Promise<string | null> {
  if (tone === 'Off') {
    await cancelAllNotifications();
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);
  
  const messages = tone === 'Silly' ? SILLY_MESSAGES : NEUTRAL_MESSAGES;
  const message = messages[Math.floor(Math.random() * messages.length)];

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "LogMyLog",
      body: message,
      sound: true,
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });

  return identifier;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function updateNotificationSchedule(
  time: string | null,
  tone: NotificationTone
): Promise<string | null> {
  await cancelAllNotifications();
  
  if (tone === 'Off' || !time) {
    return null;
  }

  return await scheduleDailyNotification(time, tone);
}

