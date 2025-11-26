import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initializeDatabase } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

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

// Debug endpoint handler
const debugHandler = (req, res) => {
    res.json({
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        headers: req.headers,
        env: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        routes: app._router.stack
            .filter(r => r.route)
            .map(r => r.route.path),
        mountedRoutes: ['/api', '/']
    });
};

// Mount debug endpoint at both paths
app.get('/debug-path', debugHandler);
app.get('/api/debug-path', debugHandler);

// Mount routes at BOTH / and /api to handle all Vercel routing scenarios
app.use('/api', routes);
app.use('/', routes);

console.log('[Server] Routes mounted at both / and /api');

// Custom 404 Handler to debug routing issues
app.use((req, res) => {
    console.log(`[404] ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Not Found',
        message: `No route found for ${req.method} ${req.url}`,
        debug: {
            url: req.url,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl
        }
    });
});

// Start server for local development
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
