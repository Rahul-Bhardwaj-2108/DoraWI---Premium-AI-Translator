import express from 'express';
import Favorite from '../models/Favorite.js';
import jwt from 'jsonwebtoken';
import { isDbConnected } from '../index.js';
import { mockFavorites } from '../store.js';

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

// GET /api/favorites - Get user's favorites
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (!isDbConnected) {
            const favorites = mockFavorites[req.user.id] || [];
            return res.json(favorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }

        const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: "Error fetching favorites" });
    }
});

// POST /api/favorites - Add to favorites
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { original, translated, fromLang, toLang } = req.body;

        const newFav = {
            userId: req.user.id,
            original,
            translated,
            fromLang,
            toLang,
            createdAt: new Date()
        };

        if (!isDbConnected) {
            if (!mockFavorites[req.user.id]) mockFavorites[req.user.id] = [];

            // Check duplicates (simple check)
            const exists = mockFavorites[req.user.id].some(f => f.original === original && f.toLang === toLang);
            if (exists) return res.status(400).json({ message: "Already saved" });

            newFav._id = Date.now().toString(); // Mock ID
            mockFavorites[req.user.id].push(newFav);
            return res.status(201).json(newFav);
        }

        // Check duplicates
        const existing = await Favorite.findOne({ userId: req.user.id, original, toLang });
        if (existing) return res.status(400).json({ message: "Already saved" });

        const favorite = new Favorite(newFav);
        await favorite.save();
        res.status(201).json(favorite);
    } catch (err) {
        res.status(500).json({ message: "Error saving favorite" });
    }
});

// DELETE /api/favorites/:id - Remove favorite
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (!isDbConnected) {
            const favorites = mockFavorites[req.user.id] || [];
            mockFavorites[req.user.id] = favorites.filter(f => f._id !== req.params.id);
            return res.json({ message: "Favorite removed" });
        }

        await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Favorite removed" });
    } catch (err) {
        res.status(500).json({ message: "Error removing favorite" });
    }
});

export default router;
