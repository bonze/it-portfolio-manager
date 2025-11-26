# Vercel Deployment Configuration

## Environment Variables Required

Make sure these environment variables are set in your Vercel project settings:

### Required Variables

```
SUPABASE_URL=https://wrpkxusjrvbffgccrjqf.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycGt4dXNqcnZiZmZnY2NyanFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3NDgzNiwiZXhwIjoyMDc5NTUwODM2fQ.dteKwSMsf3T-9M0ibtVCU6vcuTfSUsJF6dXvDGWZfHw
```

## Deployment Status

✅ **Committed to GitHub**: All user management changes pushed to `main` branch
✅ **Automatic Deployment**: Vercel will automatically deploy from GitHub
✅ **Supabase Integration**: App configured to use Supabase on Vercel (VERCEL=1)

## What Happens on Deployment

1. Vercel detects the push to `main` branch
2. Builds the application with `npm run build`
3. Deploys to production URL: https://it-portfolio-manager.vercel.app/
4. Backend uses Supabase (detected via `VERCEL=1` environment variable)
5. Database operations automatically use Supabase PostgreSQL
6. User data and projects load from Supabase on startup

## Database Migration on Vercel

The app includes automatic migration logic:
- Checks if `isActive` column exists in users table
- Sets existing users to `isActive: true` automatically
- Creates default admin/operator/user accounts if they don't exist

## Testing After Deployment

1. Wait for Vercel deployment to complete (~2-3 minutes)
2. Visit https://it-portfolio-manager.vercel.app/
3. Login as admin (admin/admin123)
4. Navigate to Admin panel to manage users
5. Test user registration and approval workflow

## Monitoring Deployment

Check deployment status at:
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/bonze/it-portfolio-manager/actions

## Notes

- All data is persisted in Supabase PostgreSQL
- No local SQLite database on Vercel
- Environment variables are securely stored in Vercel settings
- SSL/TLS verification is enabled in production
