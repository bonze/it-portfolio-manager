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

// Debug endpoint to check what path Express is seeing
app.get('/debug-path', (req, res) => {
    res.json({
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        headers: req.headers,
        env: process.env.NODE_ENV,
        vercel: process.env.VERCEL
    });
});

// Mount routes at BOTH / and /api to handle all Vercel routing scenarios
// If Vercel strips /api, the '/' mount will catch it
// If Vercel keeps /api, the '/api' mount will catch it
app.use('/api', routes);
app.use('/', routes);

console.log('[Server] Routes mounted at both / and /api');

// Start server for local development
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
