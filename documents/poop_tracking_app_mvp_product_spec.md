# 💩 Poop Tracking App (Working Title)

## High‑Level Concept
A playful, low‑friction mobile app that lets users **log when they poop** using a single tap, optionally followed by quick tags (type, feeling, time). The app leans heavily into humor and simplicity while quietly delivering useful insights about regularity and habits.

This is not a medical app. It is a **habit + humor app** with strong daily retention potential.

---

## Core Design Pillars

1. **One‑Tap Logging** – Logging a poop should take under 2 seconds
2. **Optional Detail** – Tags are fun, not required
3. **Silly but Clean** – Funny tone, modern UI, not gross
4. **Privacy First** – No social pressure, no shame
5. **Stats = Delight** – Numbers should make users laugh

---

## MVP Feature Set (Phase 1)

### 🚽 Primary Action: Poop Log

**Main Screen**
- Large centered button:
  - Text: **“I Pooped”**
  - Icon: friendly poop emoji or custom icon

**On Tap:**
- Instantly logs a poop event with timestamp
- Opens optional quick‑tag modal

---

### 🏷️ Quick Tags (Optional, Swipeable)
Displayed immediately after logging. All are optional.

#### 1. Poop Type (Inspired by Bristol Scale, Simplified)
Use icons + humor, not medical terms.

Examples:
- 🪨 Rock Solid
- 🌭 Normal Hero
- 🍦 Soft Serve
- 💦 Danger Zone

(Exact names adjustable later)

---

#### 2. Feeling After
Quick emoji‑based selection:
- 😌 Relieved
- 😐 Neutral
- 😖 Regret
- 😤 Rushed
- 😎 Victorious

---

#### 3. Optional Add‑Ons (Stretch MVP)
- ⏱️ Time of day (Morning / Afternoon / Night)
- 🚽 Location (Home / Work / Public / Unknown)

All tags should be tappable in under 1 second.

---

## 📊 Stats & History

### Daily
- Poops today
- Last poop time

### Weekly
- Average poops per day
- Most common poop type

### Monthly
- Total poops
- Most productive day of the week

### Yearly
- Total poops this year
- Longest streak
- "You pooped more than X% of users" (optional, anonymized)

---

## 🔥 Streaks & Achievements (Lightweight)

### Streak Logic
- A streak = at least one poop logged per day
- Grace period: configurable (e.g., 36 hours)

### Example Achievements
- **The Regular** – 7 days in a row
- **Clockwork Colon** – Same time 3 days straight
- **Iron Gut** – No missed days in a month
- **The Phantom** – Missed 3 days (funny, not punishing)

Achievements should feel playful, never shame‑based.

---

## 🔔 Notifications

### Daily Reminder (Opt‑In)
Tone should be customizable.

**Silly Examples:**
- “Hey… did you poop today?”
- “Friendly reminder from your colon.”
- “Logs > clogs.”

**Neutral Examples:**
- “Daily log reminder.”
- “Don’t forget to track today.”

Users can select:
- Silly
- Neutral
- Off

---

## 🧠 Onboarding Flow (Ultra Short)

1. Welcome screen
   - "This app tracks your poops. That’s it."

2. Permission request
   - Notifications (optional)

3. Done
   - Land directly on main button

No accounts required for MVP.

---

## 🔐 Privacy & Data Handling

- All data stored locally by default
- No public profiles
- No social feed
- Clear copy:
  > "Your poop data is yours. We don’t want it."

Cloud backup / accounts can be Phase 2.

---

## 🎨 Visual & Tone Direction

### UI Style
- Clean, modern, minimal
- Rounded buttons
- Soft neutral colors

### Tone
- Self‑aware
- Internet humor
- Never gross or graphic

Think: **Duolingo meets bathroom humor**.

---

## 🛠️ Suggested Tech Stack (Cursor‑Friendly)

**Frontend**
- React Native or Expo
- Simple state management (Zustand or Context)

**Storage**
- Local storage (SQLite / MMKV)

**Notifications**
- Native scheduled notifications

---

## 🧪 Success Metrics (Early)

- Daily active users
- Streak completion rate
- Logs per user per week
- Notification opt‑in rate

---

## 🚀 Phase 2 Ideas (Not MVP)

- Yearly Poop Recap (Spotify Wrapped style)
- Custom notification messages
- Themes
- Health insights (optional, opt‑in)
- Anonymous aggregate stats

---

## Final Note
This app should feel like a joke that accidentally becomes a habit.

If it’s fun, fast, and frictionless — users will come back daily.

💩

