import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../index.js';
import { mockUsers } from '../store.js';

const router = express.Router();


// Register
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!isDbConnected) {
            // Fallback Mode
            const existing = mockUsers.find(u => u.email === email);
            if (existing) return res.status(400).json({ message: "User already exists (Mock)" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = { _id: Date.now().toString(), username, email, password: hashedPassword };
            mockUsers.push(newUser);

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            return res.status(201).json({ token, user: { id: newUser._id, username, email, avatar: '' } });
        }

        // DB Mode
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: newUser._id, username, email, avatar: '' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!isDbConnected) {
            // Fallback Mode
            const user = mockUsers.find(u => u.email === email);
            if (!user) return res.status(400).json({ message: "Invalid credentials (Mock)" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials (Mock)" });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            return res.json({ token, user: { id: user._id, username: user.username, email, avatar: user.avatar || '' } });
        }

        // DB Mode
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email, avatar: user.avatar || '' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
