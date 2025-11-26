import app from '../server/index.js';

// Vercel serverless function handler - catch all API routes
export default async function handler(req, res) {
    try {
        console.log(`[API] ${req.method} ${req.url}`);

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('[API Error]:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
