import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initializeDatabase } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Track if database is initialized
let dbInitialized = false;
let dbInitPromise = null;

// Middleware to ensure database is initialized
app.use(async (req, res, next) => {
    if (!dbInitialized) {
        if (!dbInitPromise) {
            dbInitPromise = initializeDatabase();
        }
        try {
            await dbInitPromise;
            dbInitialized = true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            return res.status(500).json({ error: 'Database initialization failed' });
        }
    }
    next();
});

// Mount routes at /api for ALL environments
// Vercel routes /api/* to /api/index.js but KEEPS the /api prefix in the path
// So Express needs to handle paths like /api/projects, /api/goals, etc.
app.use('/api', routes);

console.log('[Server] Routes mounted at /api');

// Start server for local development
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
