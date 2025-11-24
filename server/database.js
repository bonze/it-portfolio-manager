import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

let db;

export async function initializeDatabase() {
    const dbPath = process.env.VERCEL ? '/tmp/portfolio.db' : './portfolio.db';
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Create Users Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    `);

    // Seed Users if empty
    const userCount = await db.get('SELECT count(*) as count FROM users');
    if (userCount.count === 0) {
        const hashedPassword = await bcrypt.hash('password', 10); // Default password for all for simplicity in demo
        // In real app, use different passwords
        const adminPass = await bcrypt.hash('admin123', 10);
        const opPass = await bcrypt.hash('op123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', adminPass, 'admin']);
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['operator', opPass, 'operator']);
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['user', userPass, 'user']);
        console.log('Seeded default users');
    }

    // Create Data Tables (Storing JSON blobs for simplicity given the hierarchical structure and rapid prototyping, 
    // but for "Tách sử dụng cơ sở dữ liệu sqlite" we should try to be relational where it makes sense, 
    // OR use a key-value store approach for the entities if the schema is very dynamic. 
    // Given the request "Tách sử dụng cơ sở dữ liệu sqlite", I will create tables for each entity type to be proper.)

    // Projects
    await db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            data TEXT -- JSON content including name, description, etc.
        )
    `);

    // Goals
    await db.exec(`
        CREATE TABLE IF NOT EXISTS goals (
            id TEXT PRIMARY KEY,
            projectId TEXT,
            data TEXT,
            FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
        )
    `);

    // Scopes
    await db.exec(`
        CREATE TABLE IF NOT EXISTS scopes (
            id TEXT PRIMARY KEY,
            goalId TEXT,
            data TEXT,
            FOREIGN KEY(goalId) REFERENCES goals(id) ON DELETE CASCADE
        )
    `);

    // Deliverables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS deliverables (
            id TEXT PRIMARY KEY,
            scopeId TEXT, -- Primary scope link
            data TEXT -- Includes scopeIds array for many-to-many if needed, but primarily one-to-many in this schema
        )
    `);

    // Note: The existing app allows many-to-many for deliverables<->scopes? 
    // The StoreContext says: "d.scopeIds.includes(entityId)". 
    // For simplicity in SQLite, I will store the core data in 'data' JSON column, 
    // but maintain the ID for lookups.

    console.log('Database initialized');
}

export function getDb() {
    return db;
}
