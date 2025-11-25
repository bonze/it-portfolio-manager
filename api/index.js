import app from '../server/index.js';

// Vercel serverless function handler
export default async function handler(req, res) {
    // Let Express handle the request
    return app(req, res);
}
