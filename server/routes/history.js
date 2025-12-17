import express from 'express';

import History from '../models/History.js'; // Note .js extension
import jwt from 'jsonwebtoken';
import { isDbConnected } from '../index.js';
import { mockHistory } from '../store.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// GET /api/history - Get user history
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (!isDbConnected) {
            // Fallback: Return mock history
            const userHistory = mockHistory[req.user.id] || [];
            return res.json(userHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }

        const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ message: 'Server error fetching history' });
    }
});

// POST /api/history - Save translation
router.post('/', authenticateToken, async (req, res) => {
    const { original, translated, fromLang, toLang } = req.body;

    try {
        const historyItem = {
            userId: req.user.id,
            original,
            translated,
            fromLang,
            toLang,
            createdAt: new Date()
        };

        if (!isDbConnected) {
            // Fallback: Save to in-memory store
            if (!mockHistory[req.user.id]) {
                mockHistory[req.user.id] = [];
            }
            mockHistory[req.user.id].push(historyItem);
            return res.status(201).json(historyItem);
        }

        const newHistory = new History(historyItem);
        await newHistory.save();
        res.status(201).json(newHistory);
    } catch (err) {
        console.error('Error saving history:', err);
        res.status(500).json({ message: 'Server error saving history' });
    }
});

export default router;
