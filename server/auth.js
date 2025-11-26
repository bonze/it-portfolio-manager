import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbOps } from './db.js';

const SECRET_KEY = 'your-secret-key-should-be-in-env'; // In a real app, use .env

export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await dbOps.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account is pending admin approval. Please contact an administrator.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

export function authorizeRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}
