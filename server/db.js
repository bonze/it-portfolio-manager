// Database abstraction layer - uses SQLite locally, Supabase on Vercel
import initSqlJs from 'sql.js';
import { supabase } from './supabase.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const IS_VERCEL = process.env.VERCEL === '1';
let db;
const DB_FILE = './portfolio.db';

// Initialize database based on environment
export async function initializeDatabase() {
    if (IS_VERCEL) {
        console.log('Using Supabase (Vercel environment)');
        await seedUsersSupabase();
    } else {
        console.log('Using SQLite (Local environment)');
        const SQL = await initSqlJs();

        // Load existing database or create new one
        if (fs.existsSync(DB_FILE)) {
            const buffer = fs.readFileSync(DB_FILE);
            db = new SQL.Database(buffer);
        } else {
            db = new SQL.Database();
        }

        createSQLiteTables();
        await seedUsersSQLite();
    }
}

// Save database to file
function saveDatabase() {
    if (!IS_VERCEL && db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_FILE, buffer);
    }
}

// Create SQLite tables
function createSQLiteTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT,
            isActive INTEGER DEFAULT 0
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_project_access (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            projectId TEXT,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE,
            UNIQUE(userId, projectId)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            data TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS goals (
            id TEXT PRIMARY KEY,
            projectId TEXT,
            data TEXT,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS scopes (
            id TEXT PRIMARY KEY,
            goalId TEXT,
            data TEXT,
            FOREIGN KEY(goalId) REFERENCES goals(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS deliverables (
            id TEXT PRIMARY KEY,
            scopeId TEXT,
            data TEXT
        );
    `);

    saveDatabase();
}

// Seed users for SQLite
async function seedUsersSQLite() {
    const result = db.exec('SELECT count(*) as count FROM users');
    const userCount = result.length > 0 ? result[0].values[0][0] : 0;

    if (userCount === 0) {
        const adminPass = await bcrypt.hash('admin123', 10);
        const opPass = await bcrypt.hash('op123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['admin', adminPass, 'admin', 1]);
        db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['operator', opPass, 'operator', 1]);
        db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['user', userPass, 'user', 1]);

        saveDatabase();
        console.log('Seeded default users (SQLite)');
    } else {
        // Migration: Add isActive column if it doesn't exist and set existing users to active
        try {
            db.run('ALTER TABLE users ADD COLUMN isActive INTEGER DEFAULT 0');
            db.run('UPDATE users SET isActive = 1 WHERE isActive IS NULL OR isActive = 0');
            saveDatabase();
            console.log('Migrated existing users to active status');
        } catch (e) {
            // Column might already exist, ignore error
        }
    }
}

// Seed users for Supabase
async function seedUsersSupabase() {
    try {
        const { data: existingUsers } = await supabase.from('users').select('id');

        if (!existingUsers || existingUsers.length === 0) {
            const adminPass = await bcrypt.hash('admin123', 10);
            const opPass = await bcrypt.hash('op123', 10);
            const userPass = await bcrypt.hash('user123', 10);

            await supabase.from('users').insert([
                { username: 'admin', password: adminPass, role: 'admin', isActive: true },
                { username: 'operator', password: opPass, role: 'operator', isActive: true },
                { username: 'user', password: userPass, role: 'user', isActive: true }
            ]);
            console.log('Seeded default users (Supabase)');
        } else {
            // Migration: Set existing users to active if they don't have isActive field
            await supabase.from('users').update({ isActive: true }).is('isActive', null);
            console.log('Migrated existing users to active status (Supabase)');
        }
    } catch (e) {
        console.error('Supabase seeding skipped:', e.message);
    }
}

// Abstracted database operations
export const dbOps = {
    // Get user by username
    async getUserByUsername(username) {
        if (IS_VERCEL) {
            const { data } = await supabase.from('users').select('*').eq('username', username).single();
            return data;
        } else {
            const result = db.exec('SELECT * FROM users WHERE username = ?', [username]);
            if (result.length > 0 && result[0].values.length > 0) {
                const row = result[0].values[0];
                const columns = result[0].columns;
                const user = {};
                columns.forEach((col, idx) => { user[col] = row[idx]; });
                return user;
            }
            return null;
        }
    },

    // Create new user
    async createUser(username, hashedPassword, role, isActive = false) {
        if (IS_VERCEL) {
            await supabase.from('users').insert({
                username,
                password: hashedPassword,
                role,
                isActive
            });
        } else {
            db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, role, isActive ? 1 : 0]);
            saveDatabase();
        }
    },

    // Get all items from a table
    async getAll(tableName) {
        if (IS_VERCEL) {
            const { data } = await supabase.from(tableName).select('*');
            return (data || []).map(item => ({ ...item.data, id: item.id }));
        } else {
            const result = db.exec(`SELECT * FROM ${tableName}`);
            if (result.length === 0) return [];

            const items = [];
            result[0].values.forEach(row => {
                const item = {};
                result[0].columns.forEach((col, idx) => { item[col] = row[idx]; });
                items.push({ ...JSON.parse(item.data), id: item.id });
            });
            return items;
        }
    },

    // Insert item
    async insert(tableName, item) {
        if (IS_VERCEL) {
            const row = { id: item.id, data: item };
            if (tableName === 'goals') row.projectId = item.projectId;
            if (tableName === 'scopes') row.goalId = item.goalId;
            if (tableName === 'deliverables') row.scopeId = item.scopeId || (item.scopeIds ? item.scopeIds[0] : null);

            await supabase.from(tableName).insert(row);
        } else {
            let projectId = null, goalId = null, scopeId = null;
            if (tableName === 'goals') projectId = item.projectId;
            if (tableName === 'scopes') goalId = item.goalId;
            if (tableName === 'deliverables') scopeId = item.scopeId || (item.scopeIds ? item.scopeIds[0] : null);

            const cols = ['id'];
            const vals = [item.id];
            const placeholders = ['?'];

            if (projectId) { cols.push('projectId'); vals.push(projectId); placeholders.push('?'); }
            if (goalId) { cols.push('goalId'); vals.push(goalId); placeholders.push('?'); }
            if (scopeId) { cols.push('scopeId'); vals.push(scopeId); placeholders.push('?'); }

            cols.push('data');
            vals.push(JSON.stringify(item));
            placeholders.push('?');

            db.run(`INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`, vals);
            saveDatabase();
        }
    },

    // Update item
    async update(tableName, id, item) {
        if (IS_VERCEL) {
            await supabase.from(tableName).update({ data: item }).eq('id', id);
        } else {
            db.run(`UPDATE ${tableName} SET data = ? WHERE id = ?`, [JSON.stringify(item), id]);
            saveDatabase();
        }
    },

    // Delete item
    async delete(tableName, id) {
        if (IS_VERCEL) {
            await supabase.from(tableName).delete().eq('id', id);
        } else {
            db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
            saveDatabase();
        }
    },

    // Get all users (admin only)
    async getAllUsers() {
        if (IS_VERCEL) {
            const { data } = await supabase.from('users').select('id, username, role, isActive');
            return data || [];
        } else {
            const result = db.exec('SELECT id, username, role, isActive FROM users');
            if (result.length === 0) return [];

            const users = [];
            result[0].values.forEach(row => {
                users.push({
                    id: row[0],
                    username: row[1],
                    role: row[2],
                    isActive: row[3] === 1
                });
            });
            return users;
        }
    },

    // Update user active status
    async updateUserStatus(userId, isActive) {
        if (IS_VERCEL) {
            await supabase.from('users').update({ isActive }).eq('id', userId);
        } else {
            db.run('UPDATE users SET isActive = ? WHERE id = ?', [isActive ? 1 : 0, userId]);
            saveDatabase();
        }
    },

    // Get user's project access
    async getUserProjectAccess(userId) {
        if (IS_VERCEL) {
            const { data } = await supabase.from('user_project_access').select('projectId').eq('userId', userId);
            return (data || []).map(item => item.projectId);
        } else {
            const result = db.exec('SELECT projectId FROM user_project_access WHERE userId = ?', [userId]);
            if (result.length === 0) return [];
            return result[0].values.map(row => row[0]);
        }
    },

    // Set user's project access (replaces all existing access)
    async setUserProjectAccess(userId, projectIds) {
        if (IS_VERCEL) {
            // Delete existing access
            await supabase.from('user_project_access').delete().eq('userId', userId);

            // Insert new access
            if (projectIds.length > 0) {
                const rows = projectIds.map(projectId => ({ userId, projectId }));
                await supabase.from('user_project_access').insert(rows);
            }
        } else {
            // Delete existing access
            db.run('DELETE FROM user_project_access WHERE userId = ?', [userId]);

            // Insert new access
            projectIds.forEach(projectId => {
                db.run('INSERT INTO user_project_access (userId, projectId) VALUES (?, ?)', [userId, projectId]);
            });

            saveDatabase();
        }
    },

    // Get projects filtered by user access (for non-admin users)
    async getProjectsByUserAccess(userId, userRole) {
        // Admin sees all projects
        if (userRole === 'admin') {
            const projects = await this.getAll('projects');
            return projects.map(p => ({ ...p, baseline: p.baseline || 0 }));
        }

        // Non-admin users see only assigned projects
        if (IS_VERCEL) {
            const { data: accessData } = await supabase
                .from('user_project_access')
                .select('projectId')
                .eq('userId', userId);

            if (!accessData || accessData.length === 0) return [];

            const projectIds = accessData.map(item => item.projectId);
            const { data } = await supabase.from('projects').select('*').in('id', projectIds);
            return (data || []).map(item => ({ ...item.data, id: item.id, baseline: item.data.baseline || 0 }));
        } else {
            const result = db.exec(`
                SELECT p.* FROM projects p
                INNER JOIN user_project_access upa ON p.id = upa.projectId
                WHERE upa.userId = ?
            `, [userId]);

            if (result.length === 0) return [];

            const items = [];
            result[0].values.forEach(row => {
                const item = {};
                result[0].columns.forEach((col, idx) => { item[col] = row[idx]; });
                const parsedData = JSON.parse(item.data);
                items.push({ ...parsedData, id: item.id, baseline: parsedData.baseline || 0 });
            });
            return items;
        }
    }
};

export function getDb() {
    return db;
}
