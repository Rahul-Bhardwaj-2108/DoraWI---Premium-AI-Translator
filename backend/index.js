import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import historyRoutes from './routes/history.js';
import userRoutes from './routes/user.js';
import favoriteRoutes from './routes/favorites.js';
import documentRoutes from './routes/document.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/document', documentRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('DoraWi API is running');
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

export let isDbConnected = false;

if (!MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not defined. Using in-memory fallback.");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log("✅ MongoDB Connected");
            isDbConnected = true;
        })
        .catch(err => {
            console.error("❌ MongoDB Connection Error (Switching to Fallback Mode):", err.message);
            // We do NOT exit, allowing fallback to work
        });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
