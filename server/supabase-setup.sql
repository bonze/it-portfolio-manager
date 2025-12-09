-- =====================================================
-- SUPABASE SCHEMA SETUP - IT Portfolio Manager
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing tables if you want to start fresh (CAREFUL!)
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS vendor_evaluations CASCADE;
-- DROP TABLE IF EXISTS investment_categories CASCADE;
-- DROP TABLE IF EXISTS project_baselines CASCADE;
-- DROP TABLE IF EXISTS deliverables CASCADE;
-- DROP TABLE IF EXISTS scopes CASCADE;
-- DROP TABLE IF EXISTS goals CASCADE;
-- DROP TABLE IF EXISTS user_project_access CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to users" ON users;
CREATE POLICY "Allow all access to users" ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    data JSONB
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to projects" ON projects;
CREATE POLICY "Allow all access to projects" ON projects
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- USER PROJECT ACCESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_project_access (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "projectId" TEXT REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE("userId", "projectId")
);

ALTER TABLE user_project_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to user_project_access" ON user_project_access;
CREATE POLICY "Allow all access to user_project_access" ON user_project_access
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    "projectId" TEXT REFERENCES projects(id) ON DELETE CASCADE,
    data JSONB
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to goals" ON goals;
CREATE POLICY "Allow all access to goals" ON goals
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- SCOPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS scopes (
    id TEXT PRIMARY KEY,
    "goalId" TEXT REFERENCES goals(id) ON DELETE CASCADE,
    data JSONB
);

ALTER TABLE scopes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to scopes" ON scopes;
CREATE POLICY "Allow all access to scopes" ON scopes
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- DELIVERABLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY,
    "scopeId" TEXT,
    data JSONB
);

ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to deliverables" ON deliverables;
CREATE POLICY "Allow all access to deliverables" ON deliverables
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- PROJECT BASELINES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS project_baselines (
    id SERIAL PRIMARY KEY,
    "projectId" TEXT REFERENCES projects(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    data JSONB NOT NULL,
    UNIQUE("projectId", version)
);

ALTER TABLE project_baselines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to project_baselines" ON project_baselines;
CREATE POLICY "Allow all access to project_baselines" ON project_baselines
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- INVESTMENT CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS investment_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    "priorityWeight" INTEGER DEFAULT 1 CHECK ("priorityWeight" >= 1 AND "priorityWeight" <= 10),
    "strategicImportance" INTEGER DEFAULT 1 CHECK ("strategicImportance" >= 1 AND "strategicImportance" <= 10),
    color TEXT DEFAULT '#6366f1',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

ALTER TABLE investment_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to investment_categories" ON investment_categories;
CREATE POLICY "Allow all access to investment_categories" ON investment_categories
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- VENDOR EVALUATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_evaluations (
    id SERIAL PRIMARY KEY,
    "vendorName" TEXT NOT NULL,
    "projectId" TEXT REFERENCES projects(id) ON DELETE CASCADE,
    "qualityScore" INTEGER CHECK ("qualityScore" >= 1 AND "qualityScore" <= 5),
    "timelinessScore" INTEGER CHECK ("timelinessScore" >= 1 AND "timelinessScore" <= 5),
    "communicationScore" INTEGER CHECK ("communicationScore" >= 1 AND "communicationScore" <= 5),
    "costEffectivenessScore" INTEGER CHECK ("costEffectivenessScore" >= 1 AND "costEffectivenessScore" <= 5),
    "overallRating" DECIMAL(3,2),
    comments TEXT,
    "evaluatedBy" TEXT,
    "evaluatedAt" TIMESTAMP DEFAULT NOW()
);

ALTER TABLE vendor_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to vendor_evaluations" ON vendor_evaluations;
CREATE POLICY "Allow all access to vendor_evaluations" ON vendor_evaluations
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    action TEXT NOT NULL,
    changes JSONB,
    "userId" INTEGER REFERENCES users(id),
    username TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to audit_logs" ON audit_logs;
CREATE POLICY "Allow all access to audit_logs" ON audit_logs
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_vendor_evaluations_vendor ON vendor_evaluations("vendorName");
CREATE INDEX IF NOT EXISTS idx_vendor_evaluations_project ON vendor_evaluations("projectId");
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs("entityType", "entityId");
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- =====================================================
-- SEED DEFAULT INVESTMENT CATEGORIES
-- =====================================================
INSERT INTO investment_categories (id, name, description, "priorityWeight", "strategicImportance", color) VALUES
('digital-transformation', 'Digital Transformation', 'Projects focused on digital innovation and business transformation', 10, 10, '#8b5cf6'),
('infrastructure', 'Infrastructure', 'IT infrastructure, networking, and hardware projects', 7, 8, '#3b82f6'),
('security', 'Security', 'Cybersecurity and information security initiatives', 9, 9, '#ef4444'),
('applications', 'Applications', 'Business application development and enhancement', 6, 7, '#10b981'),
('maintenance', 'Maintenance', 'System maintenance and support activities', 3, 4, '#6b7280'),
('uncategorized', 'Uncategorized', 'Projects not yet categorized', 1, 1, '#9ca3af')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED DEFAULT USERS
-- Note: Run the seed-supabase.js script to insert users
-- with properly hashed passwords
-- =====================================================

-- Verify tables were created
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'goals', COUNT(*) FROM goals
UNION ALL
SELECT 'scopes', COUNT(*) FROM scopes
UNION ALL
SELECT 'deliverables', COUNT(*) FROM deliverables
UNION ALL
SELECT 'user_project_access', COUNT(*) FROM user_project_access
UNION ALL
SELECT 'project_baselines', COUNT(*) FROM project_baselines
UNION ALL
SELECT 'investment_categories', COUNT(*) FROM investment_categories
UNION ALL
SELECT 'vendor_evaluations', COUNT(*) FROM vendor_evaluations
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;
