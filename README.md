# Issue Monitor V4 — Direct Link

## Vercel Environment Variables

Add these in Vercel Project → Settings → Environment Variables:

### SUPABASE_DASHBOARD_API_BASE
https://ubbsavvrophkbntnklso.supabase.co/functions/v1/issue-dashboard

### DASHBOARD_ADMIN_KEY
Use the same value currently stored in Supabase Edge Functions → Secrets → DASHBOARD_ADMIN_KEY.

Set both as Secret for Production. After adding/changing environment variables, redeploy the project.

## Project structure

index.html
api/dashboard.js
vercel.json

The browser never receives DASHBOARD_ADMIN_KEY. The Vercel Function reads it server-side and forwards authorized requests to Supabase.
