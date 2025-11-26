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

// Mount routes
// On Vercel/production: routes at root since /api/* is handled by Vercel routing
// On local dev: routes at /api
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const routePrefix = isProduction ? '/' : '/api';

console.log('[Server] Environment:', { NODE_ENV: process.env.NODE_ENV, VERCEL: process.env.VERCEL, routePrefix });

app.use(routePrefix, routes);

// Start server for local development
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
