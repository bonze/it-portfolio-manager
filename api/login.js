import { login } from '../server/auth.js';
import { initializeDatabase } from '../server/db.js';

// Initialize database once
let dbInitialized = false;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Initialize database if not already done
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Call the login handler
    return login(req, res);
}
