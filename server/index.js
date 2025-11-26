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
// On Vercel: /api/* is routed to /api/index.js, and the path is stripped to /*
// So /api/projects becomes /projects in the serverless function
// On local: we use /api prefix
const routePrefix = process.env.VERCEL ? '/' : '/api';
app.use(routePrefix, routes);

// Start server for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
