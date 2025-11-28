# IT Portfolio Manager 📊

A comprehensive web application for managing IT project portfolios with hierarchical structure, automated completion tracking, and analytics dashboard.

## 🌐 Live Demo

**Production URL:** https://it-portfolio-manager.vercel.app/

## ✨ Features

- **Hierarchical Project Structure**: Project → Goal → Scope → Deliverable
- **Automated Completion Tracking**: Automatic percentage calculation based on deliverable status
- **Budget & KPI Management**: Track budgets, variances, and key performance indicators
- **Baseline & Change Management**: Version control for project baselines with approval workflow
- **User Management**: Role-based access control (Admin, Operator, User)

## 📥 Import Data

Use the provided Excel templates to import your project data:
- **Template:** `project_template_v2.xlsx` (Empty template with all columns)
- **Sample Data:** `sample_data_v2.xlsx` (Example data to test analytics)

### Supported Data Columns (Projects Sheet):
- **Basic:** Name, Description, Owner, BusinessUnit, Status
- **Financial:** Budget Plan, Budget Actual, Budget Additional
- **Vendor:** Vendor Name, Vendor Contact, Vendor Value
- **Resources:** Man Days Plan, Man Days Actual
- **Analytics Dashboard**: Visual insights with charts and metrics
- **Real-time Updates**: Instant UI updates with React state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL) for production
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API
- **Charts**: Custom SVG-based visualizations
- **Deployment**: Vercel with GitHub Actions CI/CD

## 🔐 Security

This project follows security best practices:
- ✅ No hardcoded passwords or secrets in source code
- ✅ Environment variables for sensitive configuration
- ✅ `.env` files excluded from version control
- ✅ Secure password hashing with bcrypt

## 📦 Deployment Setup

### Prerequisites
1. GitHub account
2. Vercel account (free tier works)
3. Supabase account (free tier works)

### Step 1: Setup Supabase
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL schema from `server/supabase-setup.sql`
3. Get your `SUPABASE_URL` and `SUPABASE_KEY` (service role key)

### Step 2: Setup Vercel
1. Import your GitHub repository to Vercel
2. Add environment variables in Vercel project settings:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NODE_ENV=production`

### Step 3: Setup GitHub Actions (Optional - for auto-deploy)
See detailed instructions in [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)

1. Get Vercel token, org ID, and project ID
2. Add GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### Step 4: Deploy
```bash
# Push to GitHub
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will automatically build and deploy to Vercel! 🎉

## 🔧 Local Development (Optional)

If you need to run locally for development:

```bash
# Clone the repository
git clone https://github.com/your-username/it-portfolio-manager.git
cd it-portfolio-manager

# Install dependencies
npm install

# Setup environment variables
cp .env.example server/.env
# Edit server/.env with your Supabase credentials

# Run development server
npm run dev
```

**Note**: Local development uses SQLite by default. Vercel deployment uses Supabase.

## 📝 First-Time Setup

After deployment, create your first admin user:

1. Use the registration API endpoint or Supabase dashboard
2. Insert a user directly into the `users` table:
   ```sql
   INSERT INTO users (username, password, role, isActive)
   VALUES ('admin', 'your_bcrypt_hashed_password', 'admin', true);
   ```

## 🔄 Workflow

1. **Make changes** to your code locally
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **GitHub Actions** automatically builds and deploys
4. **Vercel** serves your updated application

## 📊 Usage

1. **Login**: Use your admin credentials
2. **Add Projects**: Click "Add New Project" to create a project with goals
3. **Import from Excel**: Use the "Import from Excel" button to bulk import
4. **Track Progress**: Mark deliverables as complete to auto-update percentages
5. **Manage Users**: Admin can activate/deactivate users and assign project access
6. **View Analytics**: Navigate to the Analytics tab for insights

## 📁 Project Structure

```
it-portfolio-manager/
├── .github/workflows/    # GitHub Actions CI/CD
├── api/                  # Vercel serverless functions
├── server/               # Backend Express server
├── src/                  # React frontend
├── public/               # Static assets
├── .env.example          # Environment variables template
└── vercel.json          # Vercel configuration
```

## 🛡️ Environment Variables

Required environment variables (set in Vercel):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key
- `NODE_ENV`: Set to `production`

Optional (local development only):
- `DEFAULT_ADMIN_PASSWORD`: For seeding default users locally

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
