// Database abstraction layer - uses SQLite locally, Supabase on Vercel
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
        const initSqlJs = (await import('sql.js')).default;
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
        CREATE TABLE IF NOT EXISTS final_products (
            id TEXT PRIMARY KEY,
            projectId TEXT,
            data TEXT,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS phases (
            id TEXT PRIMARY KEY,
            finalProductId TEXT,
            data TEXT,
            FOREIGN KEY(finalProductId) REFERENCES final_products(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS deliverables (
            id TEXT PRIMARY KEY,
            phaseId TEXT,
            data TEXT,
            FOREIGN KEY(phaseId) REFERENCES phases(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS work_packages (
            id TEXT PRIMARY KEY,
            deliverableId TEXT,
            data TEXT,
            FOREIGN KEY(deliverableId) REFERENCES deliverables(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS project_baselines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId TEXT,
            version INTEGER,
            data TEXT,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS kpis (
            id TEXT PRIMARY KEY,
            entityType TEXT NOT NULL,
            entityId TEXT NOT NULL,
            name TEXT NOT NULL,
            target REAL,
            actual REAL,
            unit TEXT,
            status TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS investment_categories (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            priorityWeight INTEGER DEFAULT 1,
            strategicImportance INTEGER DEFAULT 1,
            color TEXT DEFAULT '#6366f1',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vendor_evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendorName TEXT NOT NULL,
            projectId TEXT,
            qualityScore INTEGER,
            timelinessScore INTEGER,
            communicationScore INTEGER,
            costEffectivenessScore INTEGER,
            overallRating REAL,
            comments TEXT,
            evaluatedBy TEXT,
            evaluatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entityType TEXT NOT NULL,
            entityId TEXT NOT NULL,
            action TEXT NOT NULL,
            changes TEXT,
            userId INTEGER,
            username TEXT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id)
        );
    `);

    // Seed default investment categories
    const categories = [
        ['digital-transformation', 'Digital Transformation', 'Projects focused on digital innovation and business transformation', 10, 10, '#8b5cf6'],
        ['infrastructure', 'Infrastructure', 'IT infrastructure, networking, and hardware projects', 7, 8, '#3b82f6'],
        ['security', 'Security', 'Cybersecurity and information security initiatives', 9, 9, '#ef4444'],
        ['applications', 'Applications', 'Business application development and enhancement', 6, 7, '#10b981'],
        ['maintenance', 'Maintenance', 'System maintenance and support activities', 3, 4, '#6b7280'],
        ['uncategorized', 'Uncategorized', 'Projects not yet categorized', 1, 1, '#9ca3af']
    ];

    categories.forEach(([id, name, description, priorityWeight, strategicImportance, color]) => {
        db.run(`
            INSERT OR IGNORE INTO investment_categories (id, name, description, priorityWeight, strategicImportance, color)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id, name, description, priorityWeight, strategicImportance, color]);
    });

    saveDatabase();
}

// Seed users for SQLite
async function seedUsersSQLite() {
    const result = db.exec('SELECT count(*) as count FROM users');
    const userCount = result.length > 0 ? result[0].values[0][0] : 0;

    if (userCount === 0) {
        // Only seed default users if environment variable is set (for local development)
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (defaultPassword) {
            const adminPass = await bcrypt.hash(defaultPassword, 10);
            const opPass = await bcrypt.hash(defaultPassword, 10);
            const userPass = await bcrypt.hash(defaultPassword, 10);

            db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['admin', adminPass, 'admin', 1]);
            db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['operator', opPass, 'operator', 1]);
            db.run('INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)', ['user', userPass, 'user', 1]);

            saveDatabase();
            console.log('Seeded default users (SQLite) with password from environment');
        } else {
            console.log('Skipping user seeding - DEFAULT_ADMIN_PASSWORD not set');
        }
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

        // Migration: Add scopeId to deliverables if it doesn't exist
        try {
            db.run('ALTER TABLE deliverables ADD COLUMN scopeId TEXT');
            saveDatabase();
            console.log('Migrated deliverables table: added scopeId column');
        } catch (e) {
            // Column likely exists, ignore
        }
    }
}

// Seed users for Supabase
async function seedUsersSupabase() {
    try {
        const { data: existingUsers } = await supabase.from('users').select('id');

        if (!existingUsers || existingUsers.length === 0) {
            // Only seed default users if environment variable is set (for local development)
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

            if (defaultPassword) {
                const adminPass = await bcrypt.hash(defaultPassword, 10);
                const opPass = await bcrypt.hash(defaultPassword, 10);
                const userPass = await bcrypt.hash(defaultPassword, 10);

                await supabase.from('users').insert([
                    { username: 'admin', password: adminPass, role: 'admin', isActive: true },
                    { username: 'operator', password: opPass, role: 'operator', isActive: true },
                    { username: 'user', password: userPass, role: 'user', isActive: true }
                ]);
                console.log('Seeded default users (Supabase) with password from environment');
            } else {
                console.log('Skipping user seeding - DEFAULT_ADMIN_PASSWORD not set');
            }
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
            const { data, error } = await supabase.from(tableName).select('*');
            if (error) {
                console.error(`Supabase getAll error for ${tableName}:`, error);
                throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
            }
            console.log(`Supabase getAll ${tableName} returned ${data?.length || 0} items`);
            return (data || []).map(item => {
                if (!item.data) return { id: item.id };
                const parsedData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
                return { ...parsedData, id: item.id };
            });
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
            if (tableName === 'final_products') row.projectId = item.projectId;
            if (tableName === 'phases') row.finalProductId = item.finalProductId;
            if (tableName === 'deliverables') row.phaseId = item.phaseId;
            if (tableName === 'work_packages') row.deliverableId = item.deliverableId;

            const { error } = await supabase.from(tableName).insert(row);
            if (error) {
                console.error(`Supabase insert error for ${tableName}:`, error);
                throw new Error(`Failed to insert into ${tableName}: ${error.message}`);
            }
            console.log(`Supabase insert into ${tableName} successful:`, item.id);
        } else {
            let projectId = null, finalProductId = null, phaseId = null, deliverableId = null;
            if (tableName === 'final_products') projectId = item.projectId;
            if (tableName === 'phases') finalProductId = item.finalProductId;
            if (tableName === 'deliverables') phaseId = item.phaseId;
            if (tableName === 'work_packages') deliverableId = item.deliverableId;

            const cols = ['id'];
            const vals = [item.id];
            const placeholders = ['?'];

            if (projectId) { cols.push('projectId'); vals.push(projectId); placeholders.push('?'); }
            if (finalProductId) { cols.push('finalProductId'); vals.push(finalProductId); placeholders.push('?'); }
            if (phaseId) { cols.push('phaseId'); vals.push(phaseId); placeholders.push('?'); }
            if (deliverableId) { cols.push('deliverableId'); vals.push(deliverableId); placeholders.push('?'); }

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
            const { error } = await supabase.from(tableName).update({ data: item }).eq('id', id);
            if (error) {
                console.error(`Supabase update error for ${tableName}:`, error);
                throw new Error(`Failed to update ${tableName}: ${error.message}`);
            }
            console.log(`Supabase update ${tableName} successful:`, id);
        } else {
            db.run(`UPDATE ${tableName} SET data = ? WHERE id = ?`, [JSON.stringify(item), id]);
            saveDatabase();
        }
    },

    // Delete item
    async delete(tableName, id) {
        if (IS_VERCEL) {
            const { error } = await supabase.from(tableName).delete().eq('id', id);
            if (error) {
                console.error(`Supabase delete error for ${tableName}:`, error);
                throw new Error(`Failed to delete from ${tableName}: ${error.message}`);
            }
            console.log(`Supabase delete from ${tableName} successful:`, id);
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

    // Update user info (password, role)
    async updateUser(userId, updates) {
        if (IS_VERCEL) {
            await supabase.from('users').update(updates).eq('id', userId);
        } else {
            const fields = [];
            const values = [];
            if (updates.password) { fields.push('password = ?'); values.push(updates.password); }
            if (updates.role) { fields.push('role = ?'); values.push(updates.role); }

            if (fields.length > 0) {
                values.push(userId);
                db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
                saveDatabase();
            }
        }
    },

    // Delete user
    async deleteUser(userId) {
        if (IS_VERCEL) {
            await supabase.from('users').delete().eq('id', userId);
        } else {
            db.run('DELETE FROM users WHERE id = ?', [userId]);
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

    // Add user access to a single project
    async addUserProjectAccess(userId, projectId) {
        if (IS_VERCEL) {
            // Check if access already exists
            const { data: existing } = await supabase
                .from('user_project_access')
                .select('id')
                .eq('userId', userId)
                .eq('projectId', projectId);

            if (!existing || existing.length == 0) {
                await supabase.from('user_project_access').insert({ userId, projectId });
            }
        } else {
            // Check if access already exists
            const checkResult = db.exec(
                'SELECT id FROM user_project_access WHERE userId = ? AND projectId = ?',
                [userId, projectId]
            );

            if (checkResult.length === 0 || checkResult[0].values.length === 0) {
                db.run(
                    'INSERT INTO user_project_access (userId, projectId) VALUES (?, ?)',
                    [userId, projectId]
                );
                saveDatabase();
            }
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
        if (IS_VERCEL) {
            if (userRole === 'admin') return this.getAll('projects');

            const { data: accessData, error: accessError } = await supabase.from('user_project_access').select('projectId').eq('userId', userId);
            if (accessError) {
                console.error('Supabase get access error:', accessError);
                throw new Error('Failed to fetch project access: ' + accessError.message);
            }

            if (!accessData || accessData.length === 0) return [];

            const projectIds = accessData.map(item => item.projectId);
            const { data, error } = await supabase.from('projects').select('*').in('id', projectIds);
            if (error) {
                console.error('Supabase get projects error:', error);
                throw new Error('Failed to fetch projects: ' + error.message);
            }
            return (data || []).map(item => {
                const parsedData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
                return { ...parsedData, id: item.id, baseline: parsedData.baseline || 0 };
            });
        } else {
            // Admin sees all projects
            if (userRole === 'admin') {
                const projects = await this.getAll('projects');
                return projects.map(p => ({ ...p, baseline: p.baseline || 0 }));
            }

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
    },

    // Create a baseline snapshot
    async createBaselineSnapshot(projectId, version) {
        // 1. Fetch all data for the project
        let project, finalProducts, phases, deliverables, workPackages;

        if (IS_VERCEL) {
            const { data: pData } = await supabase.from('projects').select('*').eq('id', projectId).single();
            const pParsed = typeof pData.data === 'string' ? JSON.parse(pData.data) : pData.data;
            project = { ...pParsed, id: pData.id };

            const { data: fpData } = await supabase.from('final_products').select('*').eq('projectId', projectId);
            finalProducts = (fpData || []).map(i => {
                const parsed = typeof i.data === 'string' ? JSON.parse(i.data) : i.data;
                return { ...parsed, id: i.id };
            });

            const finalProductIds = finalProducts.map(g => g.id);
            if (finalProductIds.length > 0) {
                const { data: phData } = await supabase.from('phases').select('*').in('finalProductId', finalProductIds);
                phases = (phData || []).map(i => {
                    const parsed = typeof i.data === 'string' ? JSON.parse(i.data) : i.data;
                    return { ...parsed, id: i.id };
                });
            } else {
                phases = [];
            }

            const phaseIds = phases.map(s => s.id);
            if (phaseIds.length > 0) {
                const { data: dData } = await supabase.from('deliverables').select('*').in('phaseId', phaseIds);
                deliverables = (dData || []).map(i => {
                    const parsed = typeof i.data === 'string' ? JSON.parse(i.data) : i.data;
                    return { ...parsed, id: i.id };
                });
            } else {
                deliverables = [];
            }

            const deliverableIds = deliverables.map(d => d.id);
            if (deliverableIds.length > 0) {
                const { data: wpData } = await supabase.from('work_packages').select('*').in('deliverableId', deliverableIds);
                workPackages = (wpData || []).map(i => {
                    const parsed = typeof i.data === 'string' ? JSON.parse(i.data) : i.data;
                    return { ...parsed, id: i.id };
                });
            } else {
                workPackages = [];
            }

        } else {
            // SQLite implementation
            const pRes = db.exec('SELECT * FROM projects WHERE id = ?', [projectId]);
            project = JSON.parse(pRes[0].values[0][1]);
            project.id = pRes[0].values[0][0];

            const fpRes = db.exec('SELECT * FROM final_products WHERE projectId = ?', [projectId]);
            finalProducts = fpRes.length ? fpRes[0].values.map(r => ({ ...JSON.parse(r[2]), id: r[0] })) : [];

            const finalProductIds = finalProducts.map(g => g.id);
            phases = [];
            if (finalProductIds.length > 0) {
                const placeholders = finalProductIds.map(() => '?').join(',');
                const phRes = db.exec(`SELECT * FROM phases WHERE finalProductId IN (${placeholders})`, finalProductIds);
                phases = phRes.length ? phRes[0].values.map(r => ({ ...JSON.parse(r[2]), id: r[0] })) : [];
            }

            const phaseIds = phases.map(s => s.id);
            deliverables = [];
            if (phaseIds.length > 0) {
                const placeholders = phaseIds.map(() => '?').join(',');
                const dRes = db.exec(`SELECT * FROM deliverables WHERE phaseId IN (${placeholders})`, phaseIds);
                deliverables = dRes.length ? dRes[0].values.map(r => ({ ...JSON.parse(r[2]), id: r[0] })) : [];
            }

            const deliverableIds = deliverables.map(d => d.id);
            workPackages = [];
            if (deliverableIds.length > 0) {
                const placeholders = deliverableIds.map(() => '?').join(',');
                const wpRes = db.exec(`SELECT * FROM work_packages WHERE deliverableId IN (${placeholders})`, deliverableIds);
                workPackages = wpRes.length ? wpRes[0].values.map(r => ({ ...JSON.parse(r[2]), id: r[0] })) : [];
            }
        }

        // 2. Construct Snapshot
        const snapshot = {
            version,
            createdAt: new Date().toISOString(),
            project,
            finalProducts,
            phases,
            deliverables,
            workPackages
        };

        // 3. Insert into project_baselines
        if (IS_VERCEL) {
            const { error } = await supabase.from('project_baselines').insert({
                projectId,
                version,
                data: snapshot
            });
            if (error) throw new Error('Failed to create snapshot: ' + error.message);
        } else {
            db.run('INSERT INTO project_baselines (projectId, version, data) VALUES (?, ?, ?)',
                [projectId, version, JSON.stringify(snapshot)]);
            saveDatabase();
        }
    },

    // Get baseline history
    async getProjectBaselines(projectId) {
        if (IS_VERCEL) {
            const { data } = await supabase
                .from('project_baselines')
                .select('*')
                .eq('projectId', projectId)
                .order('version', { ascending: false });
            return (data || []).map(item => {
                const parsedData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
                return { ...parsedData, id: item.id };
            });
        } else {
            const result = db.exec('SELECT * FROM project_baselines WHERE projectId = ? ORDER BY version DESC', [projectId]);
            if (result.length === 0) return [];

            const items = [];
            result[0].values.forEach(row => {
                // row: [id, projectId, version, data]
                const data = JSON.parse(row[3]);
                items.push({ ...data, id: row[0] });
            });
            return items;
        }
    },

    // Update user password
    async updateUserPassword(userId, hashedPassword) {
        if (IS_VERCEL) {
            await supabase.from('users').update({ password: hashedPassword }).eq('id', userId);
        } else {
            db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
            saveDatabase();
        }
    },

    // =====================================================
    // INVESTMENT CATEGORIES OPERATIONS
    // =====================================================

    async getAllCategories() {
        if (IS_VERCEL) {
            const { data } = await supabase.from('investment_categories').select('*').order('priorityWeight', { ascending: false });
            return data || [];
        } else {
            const result = db.exec('SELECT * FROM investment_categories ORDER BY priorityWeight DESC');
            if (result.length === 0) return [];

            const categories = [];
            result[0].values.forEach(row => {
                categories.push({
                    id: row[0],
                    name: row[1],
                    description: row[2],
                    priorityWeight: row[3],
                    strategicImportance: row[4],
                    color: row[5],
                    createdAt: row[6],
                    updatedAt: row[7]
                });
            });
            return categories;
        }
    },

    async createCategory(category) {
        if (IS_VERCEL) {
            await supabase.from('investment_categories').insert(category);
        } else {
            db.run(`
                INSERT INTO investment_categories (id, name, description, priorityWeight, strategicImportance, color)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [category.id, category.name, category.description, category.priorityWeight, category.strategicImportance, category.color]);
            saveDatabase();
        }
    },

    async updateCategory(id, category) {
        if (IS_VERCEL) {
            await supabase.from('investment_categories').update({ ...category, updatedAt: new Date().toISOString() }).eq('id', id);
        } else {
            db.run(`
                UPDATE investment_categories 
                SET name = ?, description = ?, priorityWeight = ?, strategicImportance = ?, color = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [category.name, category.description, category.priorityWeight, category.strategicImportance, category.color, id]);
            saveDatabase();
        }
    },

    async deleteCategory(id) {
        if (IS_VERCEL) {
            await supabase.from('investment_categories').delete().eq('id', id);
        } else {
            db.run('DELETE FROM investment_categories WHERE id = ?', [id]);
            saveDatabase();
        }
    },

    // =====================================================
    // VENDOR EVALUATIONS OPERATIONS
    // =====================================================

    async getAllVendorEvaluations() {
        if (IS_VERCEL) {
            const { data } = await supabase.from('vendor_evaluations').select('*').order('evaluatedAt', { ascending: false });
            return data || [];
        } else {
            const result = db.exec('SELECT * FROM vendor_evaluations ORDER BY evaluatedAt DESC');
            if (result.length === 0) return [];

            const evaluations = [];
            result[0].values.forEach(row => {
                evaluations.push({
                    id: row[0],
                    vendorName: row[1],
                    projectId: row[2],
                    qualityScore: row[3],
                    timelinessScore: row[4],
                    communicationScore: row[5],
                    costEffectivenessScore: row[6],
                    overallRating: row[7],
                    comments: row[8],
                    evaluatedBy: row[9],
                    evaluatedAt: row[10]
                });
            });
            return evaluations;
        }
    },

    async getVendorEvaluationsByVendor(vendorName) {
        if (IS_VERCEL) {
            const { data } = await supabase.from('vendor_evaluations').select('*').eq('vendorName', vendorName).order('evaluatedAt', { ascending: false });
            return data || [];
        } else {
            const result = db.exec('SELECT * FROM vendor_evaluations WHERE vendorName = ? ORDER BY evaluatedAt DESC', [vendorName]);
            if (result.length === 0) return [];

            const evaluations = [];
            result[0].values.forEach(row => {
                evaluations.push({
                    id: row[0],
                    vendorName: row[1],
                    projectId: row[2],
                    qualityScore: row[3],
                    timelinessScore: row[4],
                    communicationScore: row[5],
                    costEffectivenessScore: row[6],
                    overallRating: row[7],
                    comments: row[8],
                    evaluatedBy: row[9],
                    evaluatedAt: row[10]
                });
            });
            return evaluations;
        }
    },

    async createVendorEvaluation(evaluation) {
        const overallRating = (
            (evaluation.qualityScore + evaluation.timelinessScore +
                evaluation.communicationScore + evaluation.costEffectivenessScore) / 4
        ).toFixed(2);

        if (IS_VERCEL) {
            await supabase.from('vendor_evaluations').insert({ ...evaluation, overallRating });
        } else {
            db.run(`
                INSERT INTO vendor_evaluations 
                (vendorName, projectId, qualityScore, timelinessScore, communicationScore, costEffectivenessScore, overallRating, comments, evaluatedBy)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [evaluation.vendorName, evaluation.projectId, evaluation.qualityScore, evaluation.timelinessScore,
            evaluation.communicationScore, evaluation.costEffectivenessScore, overallRating,
            evaluation.comments, evaluation.evaluatedBy]);
            saveDatabase();
        }
    },

    async updateVendorEvaluation(id, evaluation) {
        const overallRating = (
            (evaluation.qualityScore + evaluation.timelinessScore +
                evaluation.communicationScore + evaluation.costEffectivenessScore) / 4
        ).toFixed(2);

        if (IS_VERCEL) {
            await supabase.from('vendor_evaluations').update({ ...evaluation, overallRating }).eq('id', id);
        } else {
            db.run(`
                UPDATE vendor_evaluations 
                SET vendorName = ?, projectId = ?, qualityScore = ?, timelinessScore = ?, 
                    communicationScore = ?, costEffectivenessScore = ?, overallRating = ?, comments = ?, evaluatedBy = ?
                WHERE id = ?
            `, [evaluation.vendorName, evaluation.projectId, evaluation.qualityScore, evaluation.timelinessScore,
            evaluation.communicationScore, evaluation.costEffectivenessScore, overallRating,
            evaluation.comments, evaluation.evaluatedBy, id]);
            saveDatabase();
        }
    },

    async deleteVendorEvaluation(id) {
        if (IS_VERCEL) {
            await supabase.from('vendor_evaluations').delete().eq('id', id);
        } else {
            db.run('DELETE FROM vendor_evaluations WHERE id = ?', [id]);
            saveDatabase();
        }
    },

    // =====================================================
    // KPI OPERATIONS
    // =====================================================

    async getAllKPIs() {
        if (IS_VERCEL) {
            const { data } = await supabase.from('kpis').select('*');
            return data || [];
        } else {
            const result = db.exec('SELECT * FROM kpis');
            if (result.length === 0) return [];

            const kpis = [];
            result[0].values.forEach(row => {
                kpis.push({
                    id: row[0],
                    entityType: row[1],
                    entityId: row[2],
                    name: row[3],
                    target: row[4],
                    actual: row[5],
                    unit: row[6],
                    status: row[7],
                    createdAt: row[8],
                    updatedAt: row[9]
                });
            });
            return kpis;
        }
    },

    async getKPIsByEntity(entityType, entityId) {
        if (IS_VERCEL) {
            const { data } = await supabase.from('kpis').select('*').eq('entityType', entityType).eq('entityId', entityId);
            return data || [];
        } else {
            const result = db.exec('SELECT * FROM kpis WHERE entityType = ? AND entityId = ?', [entityType, entityId]);
            if (result.length === 0) return [];

            const kpis = [];
            result[0].values.forEach(row => {
                kpis.push({
                    id: row[0],
                    entityType: row[1],
                    entityId: row[2],
                    name: row[3],
                    target: row[4],
                    actual: row[5],
                    unit: row[6],
                    status: row[7],
                    createdAt: row[8],
                    updatedAt: row[9]
                });
            });
            return kpis;
        }
    },

    async createKPI(kpi) {
        if (IS_VERCEL) {
            await supabase.from('kpis').insert(kpi);
        } else {
            db.run(`
                INSERT INTO kpis (id, entityType, entityId, name, target, actual, unit, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [kpi.id, kpi.entityType, kpi.entityId, kpi.name, kpi.target, kpi.actual, kpi.unit, kpi.status]);
            saveDatabase();
        }
    },

    async updateKPI(id, kpi) {
        if (IS_VERCEL) {
            await supabase.from('kpis').update({ ...kpi, updatedAt: new Date().toISOString() }).eq('id', id);
        } else {
            db.run(`
                UPDATE kpis 
                SET name = ?, target = ?, actual = ?, unit = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [kpi.name, kpi.target, kpi.actual, kpi.unit, kpi.status, id]);
            saveDatabase();
        }
    },

    async deleteKPI(id) {
        if (IS_VERCEL) {
            await supabase.from('kpis').delete().eq('id', id);
        } else {
            db.run('DELETE FROM kpis WHERE id = ?', [id]);
            saveDatabase();
        }
    },

    // =====================================================
    // AUDIT LOG OPERATIONS
    // =====================================================

    async createAuditLog(entityType, entityId, action, changes, userId, username) {
        const changesJson = typeof changes === 'string' ? changes : JSON.stringify(changes);

        if (IS_VERCEL) {
            await supabase.from('audit_logs').insert({
                entityType,
                entityId,
                action,
                changes: changes,
                userId,
                username
            });
        } else {
            db.run(`
                INSERT INTO audit_logs (entityType, entityId, action, changes, userId, username)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [entityType, entityId, action, changesJson, userId, username]);
            saveDatabase();
        }
    },

    async getAuditLogs(filters = {}) {
        if (IS_VERCEL) {
            let query = supabase.from('audit_logs').select('*');

            if (filters.entityType) query = query.eq('entityType', filters.entityType);
            if (filters.entityId) query = query.eq('entityId', filters.entityId);
            if (filters.userId) query = query.eq('userId', filters.userId);

            query = query.order('timestamp', { ascending: false }).limit(filters.limit || 100);

            const { data } = await query;
            return data || [];
        } else {
            let sql = 'SELECT * FROM audit_logs WHERE 1=1';
            const params = [];

            if (filters.entityType) {
                sql += ' AND entityType = ?';
                params.push(filters.entityType);
            }
            if (filters.entityId) {
                sql += ' AND entityId = ?';
                params.push(filters.entityId);
            }
            if (filters.userId) {
                sql += ' AND userId = ?';
                params.push(filters.userId);
            }

            sql += ' ORDER BY timestamp DESC LIMIT ?';
            params.push(filters.limit || 100);

            const result = db.exec(sql, params);
            if (result.length === 0) return [];

            const logs = [];
            result[0].values.forEach(row => {
                logs.push({
                    id: row[0],
                    entityType: row[1],
                    entityId: row[2],
                    action: row[3],
                    changes: row[4] ? JSON.parse(row[4]) : null,
                    userId: row[5],
                    username: row[6],
                    timestamp: row[7]
                });
            });
            return logs;
        }
    },

    // Reset Data (Delete all project data)
    async resetData() {
        if (IS_VERCEL) {
            console.log('Resetting all data in Supabase...');
            // Delete in reverse order of dependencies
            const tables = [
                'kpis',
                'work_packages',
                'deliverables',
                'phases',
                'final_products',
                'projects',
                'project_baselines',
                'vendor_evaluations',
                'audit_logs'
            ];

            for (const table of tables) {
                console.log(`Deleting all rows from ${table}...`);
                let query = supabase.from(table).delete();

                // Use different filters based on ID type
                if (['project_baselines', 'vendor_evaluations', 'audit_logs'].includes(table)) {
                    query = query.gt('id', 0);
                } else {
                    query = query.neq('id', '00000000-0000-0000-0000-000000000000');
                }

                const { error } = await query;
                if (error) {
                    console.error(`Error resetting table ${table}:`, error.message);
                    throw new Error(`Failed to reset table ${table}: ${error.message}`);
                }
            }
            console.log('All data reset successfully in Supabase.');
        } else {
            db.run('DELETE FROM kpis');
            db.run('DELETE FROM work_packages');
            db.run('DELETE FROM deliverables');
            db.run('DELETE FROM phases');
            db.run('DELETE FROM final_products');
            db.run('DELETE FROM projects');
            db.run('DELETE FROM project_baselines');
            db.run('DELETE FROM vendor_evaluations');
            db.run('DELETE FROM audit_logs');
            saveDatabase();
        }
    }
};

export function getDb() {
    return db;
}
