# Expo Push Notifications Setup Guide

This guide will walk you through setting up Expo Push Notifications for CrapChat.

## Prerequisites

- Expo account (free tier works)
- EAS CLI installed (`npm install -g eas-cli`)
- Supabase project with Edge Functions enabled

## Step 1: Run Database Migration

Execute the push tokens migration in your Supabase SQL Editor:

```sql
-- Run: supabase/migrations/add_push_tokens_table.sql
```

## Step 2: Configure Expo Project

Your project is already configured with:
- `expo-notifications` package installed
- Project ID in `app.json`: `4d3f78de-2229-45bc-9041-3af1527c802c`
- Notification permissions in Android manifest

## Step 3: Deploy Supabase Edge Function

The Edge Function handles sending push notifications securely from the server.

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy send-crapchat-notification
   ```

   The function is located at: `supabase/functions/send-crapchat-notification/index.ts`

## Step 4: Set Up Environment Variables

The Edge Function needs your Supabase credentials. These are automatically available when deployed via Supabase CLI, but you can also set them manually:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep this secret!)

## Step 5: Test Push Notifications

### On Development Build:

1. **Register for push notifications**:
   - The app automatically registers when you open the CrapChat tab (if premium)
   - Or call `registerForPushNotifications()` manually

2. **Test locally**:
   - Create a post in a group
   - Other group members should receive push notifications

### On Production Build:

1. **Build with EAS**:
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

2. **Push notifications work automatically** on production builds

## Step 6: Handle Notification Taps

When a user taps a notification, you can navigate them to the group. Add this to your app's root component:

```typescript
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// In your root component
useEffect(() => {
  // Handle notification received while app is foregrounded
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  // Handle notification tap
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data.type === 'crapchat_post' && data.groupId) {
      router.push(`/crapchat/group/${data.groupId}`);
    }
  });

  return () => {
    subscription.remove();
    responseSubscription.remove();
  };
}, []);
```

## Troubleshooting

### Notifications not working?

1. **Check permissions**: Ensure notification permissions are granted
2. **Check tokens**: Verify tokens are being saved in `push_tokens` table
3. **Check Edge Function**: Verify the function is deployed and accessible
4. **Check logs**: Look at Supabase Edge Function logs for errors

### Testing on iOS Simulator?

- iOS Simulator doesn't support push notifications
- Use a physical device for testing

### Testing on Android Emulator?

- Android emulator supports push notifications
- Make sure you're using a Google Play Services-enabled emulator

## Production Considerations

1. **Rate Limiting**: Expo Push Notification service has rate limits
   - Free tier: 1 notification per second per device
   - Consider batching notifications

2. **Error Handling**: The Edge Function handles errors gracefully
   - Invalid tokens are automatically filtered
   - Failed notifications are logged

3. **Monitoring**: Monitor your Supabase Edge Function logs
   - Check for failed notification sends
   - Monitor token registration

## Additional Resources

- [Expo Push Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Expo Push Notification API](https://docs.expo.dev/push-notifications/sending-notifications/)

