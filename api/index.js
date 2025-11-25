import app from '../server/index.js';

// Vercel serverless function handler
export default async function handler(req, res) {
    try {
        console.log(`[API] ${req.method} ${req.url}`);
        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('[API Error]:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
