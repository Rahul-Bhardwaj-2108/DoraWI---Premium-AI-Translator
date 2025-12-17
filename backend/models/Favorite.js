import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: String, // Supports both ObjectId and mock IDs
        required: true
    },
    original: {
        type: String,
        required: true
    },
    translated: {
        type: String,
        required: true
    },
    fromLang: {
        type: String,
        required: true
    },
    toLang: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Favorite', FavoriteSchema);
