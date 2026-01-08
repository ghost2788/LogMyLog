# Deploy CrapChat Notification Edge Function

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

**Windows (using Scoop):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Or download directly:**
- Visit: https://github.com/supabase/cli/releases
- Download the Windows binary
- Add to PATH

**Or use npx (no installation needed):**
```bash
npx supabase --version
```

### Step 2: Login to Supabase

Open a terminal and run:
```bash
npx supabase login
```

This will open a browser window for authentication. Follow the prompts.

### Step 3: Link Your Project

Get your project reference ID from your Supabase dashboard URL:
- Your project URL looks like: `https://mzjbyjvtrkxisvmyzgqp.supabase.co`
- The project ref is: `mzjbyjvtrkxisvmyzgqp`

Then link:
```bash
cd C:\LogMyLog
npx supabase link --project-ref mzjbyjvtrkxisvmyzgqp
```

### Step 4: Deploy the Function

```bash
npx supabase functions deploy send-crapchat-notification
```

## Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **Create a new function**
5. Name it: `send-crapchat-notification`
6. Copy the contents of `supabase/functions/send-crapchat-notification/index.ts`
7. Paste into the editor
8. Click **Deploy**

## Option 3: Using Supabase API (Advanced)

You can also deploy via the Supabase Management API, but CLI or Dashboard are easier.

## Verify Deployment

After deployment, test the function:

```bash
curl -X POST https://mzjbyjvtrkxisvmyzgqp.supabase.co/functions/v1/send-crapchat-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"],
    "title": "Test Notification",
    "body": "This is a test",
    "data": {"type": "test"}
  }'
```

## Troubleshooting

- **"Not logged in"**: Run `npx supabase login` first
- **"Project not linked"**: Run `npx supabase link --project-ref YOUR_PROJECT_REF`
- **"Function not found"**: Make sure you're in the project root directory
- **"Permission denied"**: Check that you have the correct project access

## Next Steps

Once deployed, the function will be available at:
`https://mzjbyjvtrkxisvmyzgqp.supabase.co/functions/v1/send-crapchat-notification`

The app will automatically call this function when posts are created in CrapChat groups.

