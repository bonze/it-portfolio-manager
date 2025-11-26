-- =====================================================
-- SUPABASE SCHEMA SETUP - IT Portfolio Manager
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing tables if you want to start fresh (CAREFUL!)
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
SELECT 'user_project_access', COUNT(*) FROM user_project_access;
