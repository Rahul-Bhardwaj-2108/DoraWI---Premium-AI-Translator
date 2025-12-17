import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import History from '../models/History.js';
import { isDbConnected } from '../index.js';
import { mockUsers, mockHistory } from '../store.js';

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

// GET /api/user/stats - User statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        if (!isDbConnected) {
            const userHistory = mockHistory[userId] || [];
            const totalTranslations = userHistory.length;

            // Calc top languages from mock data
            const langCounts = {};
            userHistory.forEach(h => {
                langCounts[h.toLang] = (langCounts[h.toLang] || 0) + 1;
            });

            const topLanguages = Object.entries(langCounts)
                .map(([code, count]) => ({ code, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            return res.json({
                totalTranslations,
                topLanguages,
                wordsTranslated: totalTranslations * 12
            });
        }

        const totalTranslations = await History.countDocuments({ userId });

        // Approximate words (naive count from stored strings, or just estimate)
        // For performance, we might just sum length / 5 or something.
        // Let's do a meaningful aggregation for top languages.

        const topLanguages = await History.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: "$toLang", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        // Mock words count for now (or expensive aggregate), let's keep it simple
        const wordsTranslated = totalTranslations * 12; // Average sentence length

        res.json({
            totalTranslations,
            topLanguages: topLanguages.map(l => ({ code: l._id, count: l.count })),
            wordsTranslated
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// GET /api/user/profile - Get profile info
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        if (!isDbConnected) {
            const user = mockUsers.find(u => u._id === req.user.id);
            if (user) {
                return res.json({ username: user.username, email: user.email, avatar: user.avatar || "" });
            }
            return res.json({ username: "Guest", email: "guest@example.com", avatar: "" });
        }

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// PUT /api/user/profile - Update Avatar
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { avatar } = req.body;
        if (!isDbConnected) {
            const user = mockUsers.find(u => u._id === req.user.id);
            if (user) {
                user.avatar = avatar;
                return res.json({ message: "Profile updated (Mock)" });
            }
            return res.status(404).json({ message: "User not found (Mock)" });
        }

        await User.findByIdAndUpdate(req.user.id, { avatar });
        res.json({ message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

// PUT /api/user/password - Change Password
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!isDbConnected) return res.status(400).json({ message: "Cannot change password in offline mode" });

        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating password" });
    }
});

export default router;
