import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Initialize Gemini
// We try to get the key from multiple possible env vars
router.post('/translate', upload.single('file'), async (req, res) => {
    // Initialize Gemini inside handler to ensure env vars are loaded
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (!API_KEY) {
            return res.status(500).json({ message: 'Server missing API Key' });
        }

        let originalText = '';
        const mimeType = req.file.mimetype;

        // Extraction Logic
        if (mimeType === 'application/pdf') {
            const { PDFParse } = pdf;
            if (!PDFParse) {
                throw new Error("PDFParse class not found in library override");
            }
            const parser = new PDFParse({ data: req.file.buffer });
            const data = await parser.getText();
            originalText = data.text;
        } else if (mimeType === 'text/plain') {
            originalText = req.file.buffer.toString('utf-8');
        } else if (mimeType.startsWith('image/')) {
            // Processing for Images happens directly in generateContent below
            // We set a marker for originalText to be populated by the model's description if we want OCR first
            // But usually we just want translation. The user prompt asks for translation.
            // If we want extracted text (OCR), we might need two calls or a prompt that asks for both.
            // For now, let's treat the image itself as the source "text" effectively.
            originalText = "[Image Content]";
        } else {
            return res.status(400).json({ message: 'Unsupported file type. Use PDF, TXT, or Images (PNG/JPEG/WEBP).' });
        }

        if (mimeType !== 'application/pdf' && !mimeType.startsWith('image/') && !originalText.trim()) {
            return res.status(400).json({ message: 'Could not extract text from file' });
        }

        // Translation Logic
        const { targetLang } = req.body; // Expecting targetLang from body
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Switching back to 2.5-flash as requested, keeping retry logic for stability
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt;
        let contentParts = [];

        if (mimeType.startsWith('image/')) {
            prompt = `Transcribe the text in this image exactly as is, then provide a translation to ${targetLang || 'English'}. Return the result in JSON format with two keys: "original" (the transcribed text) and "translated" (the translation). Do not include markdown code blocks, just the raw JSON string.`;
            contentParts = [
                prompt,
                {
                    inlineData: {
                        data: req.file.buffer.toString('base64'),
                        mimeType: mimeType
                    }
                }
            ];
        } else {
            prompt = `Translate the following text to ${targetLang || 'English'}. Return ONLY the translated text, no markdown, no explanations.\n\nText:\n${originalText.substring(0, 3000)}`;
            contentParts = [prompt];
        }

        // Retry logic for 503 errors
        const generateWithRetry = async (retries = 3, delay = 1000) => {
            try {
                return await model.generateContent(contentParts);
            } catch (err) {
                if (retries > 0 && (err.message.includes('503') || err.message.includes('Overloaded'))) {
                    console.log(`Model overloaded, retrying in ${delay}ms... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return generateWithRetry(retries - 1, delay * 2);
                }
                throw err;
            }
        };

        const result = await generateWithRetry();
        const response = await result.response;
        let translatedText = response.text();

        // Parse JSON for image responses
        if (mimeType.startsWith('image/')) {
            try {
                // cleanup just in case the model adds markdown
                const cleanedText = translatedText.replace(/```json/g, '').replace(/```/g, '').trim();
                const jsonResponse = JSON.parse(cleanedText);
                originalText = jsonResponse.original || "[No text found]";
                translatedText = jsonResponse.translated || "[Translation error]";
            } catch (e) {
                console.error("Failed to parse image response JSON", e);
                // Fallback
                originalText = "[Image OCR Failed]";
                // translatedText remains as the raw response
            }
        }

        res.json({
            original: originalText,
            translated: translatedText
        });

    } catch (err) {
        console.error('Document processing error:', err);
        // Send more detailed error if possible
        const errorMessage = err.message || 'Failed to process document';
        res.status(500).json({ message: 'Failed to process document', error: errorMessage });
    }
});

export default router;
