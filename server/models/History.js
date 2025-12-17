import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: {
        type: String, // Changed to String to support both ObjectId and Mock ID (which might be generic strings)
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

export default mongoose.model('History', historySchema);
