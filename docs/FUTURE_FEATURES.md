# Future Features Documentation

## Friend System & Social Sharing

### Overview
A feature that allows users to share their poop logs with friends through in-app notifications. Friends will receive a notification when a user logs a poop, including specific details about that log.

### Implementation Plan (For Future)

#### Phase 1: User Authentication
- Implement proper user authentication system (Supabase Auth)
- User accounts with email/social login
- User profiles

#### Phase 2: Friend System
- Friend request system (send/accept/decline)
- Friends list management
- Friend status tracking (pending/accepted/blocked)

#### Phase 3: Sharing & Notifications
- Share individual poop logs with friends
- Push notifications to friends when logs are shared
- Notification preferences (enable/disable sharing notifications)
- Privacy controls (who can see your logs)

#### Phase 4: Database Schema Updates
```sql
-- Friends table
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Shared logs table (optional - could also use notifications table)
CREATE TABLE shared_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poop_id UUID NOT NULL REFERENCES poops(id),
  shared_by TEXT NOT NULL,
  shared_with TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Phase 5: Notification System
- Push notification service integration (Expo Notifications)
- Notification templates for shared logs
- Notification history/feed

### Shared Data
When a user shares a log, friends will receive a notification containing:
- **Time**: When the poop was logged
- **Type**: Poop type (Rock Solid, Normal Hero, etc.)
- **Feeling**: How the user felt (Relieved, Neutral, etc.)
- **Duration**: Time spent (Speed Run, Standard Session, etc.)

Note: Location and other sensitive details should NOT be shared for privacy.

### Privacy Considerations
- Users should be able to disable sharing entirely
- Users should be able to block/unfriend users
- Location data should never be shared
- Opt-in sharing (users choose which logs to share, if any)

### Technical Notes
- This feature requires user authentication to be implemented first
- Push notifications require Expo Notifications setup
- Friend system requires new database tables and API endpoints
- Consider rate limiting for notifications to prevent spam

