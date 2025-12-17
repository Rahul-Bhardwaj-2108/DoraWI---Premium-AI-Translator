import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { TextArea } from './ui/TextArea';
import { LanguageSelector } from './ui/LanguageSelector';
import { Button } from './ui/Button';
import { Key, Mic, MicOff, Volume2, Square, Gauge, Copy, Check, History as HistoryIcon, Star, FileText, Upload, Type, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { HistorySidebar } from './HistorySidebar';
import { ConversationView } from './ConversationView';
import { ImageView } from './ImageView';
import axios from 'axios';

import { API_BASE_URL } from '../config';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'id', name: 'Indonesian' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'sv', name: 'Swedish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'cs', name: 'Czech' },
    { code: 'sk', name: 'Slovak' },
    { code: 'ro', name: 'Romanian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'fa', name: 'Persian' },
    { code: 'ms', name: 'Malay' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'sw', name: 'Swahili' },
    { code: 'am', name: 'Amharic' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' },
    { code: 'ha', name: 'Hausa' },
    { code: 'ig', name: 'Igbo' },
    { code: 'km', name: 'Khmer' },
    { code: 'lo', name: 'Lao' },
    { code: 'my', name: 'Burmese' },
    { code: 'ka', name: 'Georgian' },
    { code: 'hy', name: 'Armenian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'uz', name: 'Uzbek' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'ky', name: 'Kyrgyz' },
    { code: 'tg', name: 'Tajik' },
    { code: 'tk', name: 'Turkmen' },
    { code: 'mn', name: 'Mongolian' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' },
    { code: 'gl', name: 'Galician' },
    { code: 'eu', name: 'Basque' },
    { code: 'ca', name: 'Catalan' },
    { code: 'cy', name: 'Welsh' },
    { code: 'ga', name: 'Irish' },
    { code: 'gd', name: 'Scottish Gaelic' },
    { code: 'mt', name: 'Maltese' },
    { code: 'is', name: 'Icelandic' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'sq', name: 'Albanian' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'st', name: 'Southern Sotho' },
    { code: 'tn', name: 'Tswana' },
    { code: 'ts', name: 'Tsonga' },
    { code: 've', name: 'Venda' },
    { code: 'ss', name: 'Swati' },
    { code: 'nr', name: 'Southern Ndebele' },
    { code: 'sn', name: 'Shona' },
    { code: 'mg', name: 'Malagasy' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'fj', name: 'Fijian' },
    { code: 'sm', name: 'Samoan' },
    { code: 'to', name: 'Tongan' },
    { code: 'mi', name: 'Maori' },
    { code: 'haw', name: 'Hawaiian' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'or', name: 'Oriya' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' },
    { code: 'as', name: 'Assamese' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'ps', name: 'Pashto' },
    { code: 'ku', name: 'Kurdish' },
    { code: 'ug', name: 'Uyghur' },
    { code: 'dv', name: 'Dhivehi' },
    { code: 'dz', name: 'Dzongkha' },
    { code: 'sg', name: 'Sango' },
    { code: 'ln', name: 'Lingala' },
    { code: 'kg', name: 'Kongo' },
    { code: 'lu', name: 'Luba-Katanga' },
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'rn', name: 'Kirundi' },
    { code: 'so', name: 'Somali' },
    { code: 'ti', name: 'Tigrinya' },
    { code: 'om', name: 'Oromo' },
    { code: 'gn', name: 'Guarani' },
    { code: 'ay', name: 'Aymara' },
    { code: 'qu', name: 'Quechua' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'ia', name: 'Interlingua' },
    { code: 'ie', name: 'Interlingue' },
    { code: 'vo', name: 'Volapük' },
    { code: 'li', name: 'Limburgish' },
    { code: 'wa', name: 'Walloon' },
    { code: 'fy', name: 'Western Frisian' },
    { code: 'gv', name: 'Manx' },
    { code: 'kw', name: 'Cornish' },
    { code: 'br', name: 'Breton' },
    { code: 'sc', name: 'Sardinian' },
    { code: 'co', name: 'Corsican' },
    { code: 'oc', name: 'Occitan' },
    { code: 'an', name: 'Aragonese' },
    { code: 'ast', name: 'Asturian' },
    { code: 'ext', name: 'Extremaduran' },
    { code: 'vec', name: 'Venetian' },
    { code: 'lmo', name: 'Lombard' },
    { code: 'nap', name: 'Neapolitan' },
    { code: 'scn', name: 'Sicilian' },
    { code: 'pms', name: 'Piedmontese' },
    { code: 'eml', name: 'Emilian-Romagnol' },
    { code: 'lij', name: 'Ligurian' },
    { code: 'fur', name: 'Friulian' },
    { code: 'lad', name: 'Ladino' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'hsb', name: 'Upper Sorbian' },
    { code: 'dsb', name: 'Lower Sorbian' },
    { code: 'szl', name: 'Silesian' },
    { code: 'ksh', name: 'Colognian' },
    { code: 'nds', name: 'Low German' },
    { code: 'frr', name: 'Northern Frisian' },
    { code: 'gsw', name: 'Swiss German' },
    { code: 'als', name: 'Tosk Albanian' },
    { code: 'rup', name: 'Aromanian' },
    { code: 'gag', name: 'Gagauz' },
    { code: 'ba', name: 'Bashkir' },
    { code: 'cv', name: 'Chuvash' },
    { code: 'os', name: 'Ossetian' },
    { code: 'ab', name: 'Abkhazian' },
    { code: 'ce', name: 'Chechen' },
    { code: 'av', name: 'Avaric' },
    { code: 'lez', name: 'Lezghian' },
    { code: 'inh', name: 'Ingush' },
    { code: 'kbd', name: 'Kabardian' },
    { code: 'ady', name: 'Adyghe' },
    { code: 'xal', name: 'Kalmyk' },
    { code: 'bua', name: 'Buryat' },
    { code: 'sah', name: 'Yakut' },
    { code: 'tyv', name: 'Tuvan' },
    { code: 'alt', name: 'Southern Altai' },
    { code: 'krc', name: 'Karachay-Balkar' },
    { code: 'nog', name: 'Nogai' },
    { code: 'crh', name: 'Crimean Tatar' },
    { code: 'kaa', name: 'Kara-Kalpak' },
    { code: 'ch', name: 'Chamorro' },
    { code: 'tet', name: 'Tetum' },
    { code: 'bi', name: 'Bislama' },
    { code: 'gil', name: 'Gilbertese' },
    { code: 'mh', name: 'Marshallese' },
    { code: 'na', name: 'Nauruan' },
    { code: 'niu', name: 'Niuean' },
    { code: 'pis', name: 'Pijin' },
    { code: 'tkl', name: 'Tokelauan' },
    { code: 'tvl', name: 'Tuvaluan' },
    { code: 'wal', name: 'Wolaytta' },
    { code: 'gez', name: 'Geez' },
    { code: 'syr', name: 'Syriac' },
    { code: 'arc', name: 'Aramaic' },
    { code: 'uga', name: 'Ugaritic' },
    { code: 'akk', name: 'Akkadian' },
    { code: 'sux', name: 'Sumerian' },
    { code: 'egy', name: 'Ancient Egyptian' },
    { code: 'cop', name: 'Coptic' },
    { code: 'got', name: 'Gothic' },
    { code: 'ang', name: 'Old English' },
    { code: 'fro', name: 'Old French' },
    { code: 'goh', name: 'Old High German' },
    { code: 'grc', name: 'Ancient Greek' },
    { code: 'lat', name: 'Latin' },
    { code: 'san', name: 'Sanskrit' },
    { code: 'pli', name: 'Pali' },
    { code: 'ave', name: 'Avestan' },
    { code: 'peo', name: 'Old Persian' },
    { code: 'sga', name: 'Old Irish' },
    { code: 'non', name: 'Old Norse' },
    { code: 'pro', name: 'Old Provençal' },
    { code: 'xho', name: 'Xhosa' },
    { code: 'zul', name: 'Zulu' },
    { code: 'sot', name: 'Southern Sotho' },
    { code: 'tsn', name: 'Tswana' },
    { code: 'tso', name: 'Tsonga' },
    { code: 'ven', name: 'Venda' },
    { code: 'ssw', name: 'Swati' },
    { code: 'nbl', name: 'Southern Ndebele' },
    { code: 'sna', name: 'Shona' },
    { code: 'mri', name: 'Maori' },
    { code: 'hmn', name: 'Hmong' },
    { code: 'chr', name: 'Cherokee' },
    { code: 'nv', name: 'Navajo' },
    { code: 'cho', name: 'Choctaw' },
    { code: 'moh', name: 'Mohawk' },
    { code: 'oj', name: 'Ojibwa' },
    { code: 'ike', name: 'Eastern Canadian Inuktitut' },
    { code: 'kal', name: 'Kalaallisut' },
    { code: 'nah', name: 'Nahuatl' },
    { code: 'yua', name: 'Yucatec Maya' },
    { code: 'kek', name: 'Kʼicheʼ' },
    { code: 'aym', name: 'Aymara' },
    { code: 'que', name: 'Quechua' },
    { code: 'grn', name: 'Guarani' },
    { code: 'pap', name: 'Papiamento' },
    { code: 'crs', name: 'Seselwa Creole French' },
    { code: 'jam', name: 'Jamaican Creole English' },
    { code: 'tpi', name: 'Tok Pisin' },
    { code: 'hif', name: 'Fiji Hindi' },
    { code: 'kri', name: 'Krio' },
    { code: 'pcm', name: 'Nigerian Pidgin' },
    { code: 'wes', name: 'Cameroon Pidgin' },
    { code: 'cpe', name: 'English-based Creoles and Pidgins' },
    { code: 'cpf', name: 'French-based Creoles and Pidgins' },
    { code: 'cpp', name: 'Portuguese-based Creoles and Pidgins' },
    { code: 'roa', name: 'Romance languages' },
    { code: 'gem', name: 'Germanic languages' },
    { code: 'cel', name: 'Celtic languages' },
    { code: 'sla', name: 'Slavic languages' },
    { code: 'bal', name: 'Baltic languages' },
    { code: 'inc', name: 'Indic languages' },
    { code: 'ira', name: 'Iranian languages' },
    { code: 'cau', name: 'Caucasian languages' },
    { code: 'tur', name: 'Turkic languages' },
    { code: 'mon', name: 'Mongolian languages' },
    { code: 'dra', name: 'Dravidian languages' },
    { code: 'afr', name: 'Afro-Asiatic languages' },
    { code: 'nic', name: 'Niger-Kordofanian languages' },
    { code: 'kho', name: 'Khoisan languages' },
    { code: 'nai', name: 'North American Indian languages' },
    { code: 'sai', name: 'South American Indian languages' },
    { code: 'paa', name: 'Papuan languages' },
    { code: 'aus', name: 'Australian languages' },
    { code: 'map', name: 'Austronesian languages' },
    { code: 'art', name: 'Artificial languages' },
    { code: 'und', name: 'Undetermined language' },
    { code: 'zxx', name: 'No linguistic content' },
];

export const TranslatorCard: React.FC = () => {
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Feature States
    const [showHistory, setShowHistory] = useState(false);
    const [mode, setMode] = useState<'text' | 'document' | 'conversation' | 'image'>('text');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const saveTranslationToHistory = async (original: string, translated: string, from: string, to: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_BASE_URL}/api/history`,
                    { original, translated, fromLang: from, toLang: to },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error('Failed to save history', err);
        }
    };

    const handleStar = async () => {
        if (!translatedText) return;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_BASE_URL}/api/favorites`,
                    {
                        original: inputText,
                        translated: translatedText,
                        fromLang: sourceLang,
                        toLang: targetLang
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error("Failed to star", err);
        }
    };

    const handleDocumentTranslate = async () => {
        if (!selectedFile) return;
        setIsTranslating(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('targetLang', targetLang);

            const res = await axios.post(`${API_BASE_URL}/api/document/translate`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setInputText(res.data.original);
            setTranslatedText(res.data.translated);
            setMode('text');
            setSelectedFile(null);

            // Optionally save document translation to history too
            await saveTranslationToHistory(res.data.original, res.data.translated, "auto", targetLang);

        } catch (err: any) {
            console.error(err);
            let errorMessage = err.response?.data?.message || err.message || "Unknown error";
            if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("limit")) {
                errorMessage = "⚠️ Usage limit exceeded. Please try again later or use a different API key.";
            }
            setTranslatedText("Error processing document: " + errorMessage);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleTranslate = async () => {
        if (!apiKey) {
            setShowKeyInput(true);
            return;
        }
        if (!inputText.trim()) return;

        setIsTranslating(true);
        try {
            const ai = new GoogleGenAI({ apiKey });

            const sourceName = languages.find(l => l.code === sourceLang)?.name || sourceLang;
            const targetName = languages.find(l => l.code === targetLang)?.name || targetLang;

            const prompt = `Translate the following text from ${sourceName} to ${targetName}. Do not include any explanations or extra text, just the translation.\n\nText: ${inputText}`;

            // Using the new SDK signature as requested
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            // The new SDK response structure: response.text is a getter or property
            const resultText = response.text || "No translation returned.";
            setTranslatedText(resultText);

            // Save to History
            await saveTranslationToHistory(inputText, resultText, sourceLang, targetLang);

        } catch (error: any) {
            console.error("Translation error:", error);
            let errorMessage = error.message || "Unknown error";

            if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("limit")) {
                errorMessage = "⚠️ Usage limit exceeded. Please try again later or use a different API key.";
            } else if (errorMessage.includes("503")) {
                errorMessage = "⚠️ Service temporarily unavailable. Please try again in a moment.";
            }

            setTranslatedText(errorMessage);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-5xl glass-panel rounded-3xl p-1 shadow-2xl overflow-hidden"
        >
            {/* API Key Input Overlay */}
            <AnimatePresence>
                {showKeyInput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-primary-900/20 border-b border-primary-500/20"
                    >
                        <div className="flex items-center gap-4 px-6 py-3">
                            <Key className="w-4 h-4 text-primary-400" />
                            <input
                                type="password"
                                placeholder="Paste your Gemini API Key here..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/40"
                            />
                            <button
                                onClick={() => setShowKeyInput(false)}
                                className="text-xs text-primary-300 hover:text-white transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode Switcher */}
            <div className="flex border-b border-[var(--glass-border)]">
                <button
                    onClick={() => setMode('text')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'text' ? 'bg-[var(--glass-bg)] text-primary border-b-2 border-primary' : 'hover:bg-white/5 text-muted'}`}
                >
                    <Type className="w-4 h-4" />
                    Text
                </button>
                <button
                    onClick={() => setMode('document')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'document' ? 'bg-[var(--glass-bg)] text-primary border-b-2 border-primary' : 'hover:bg-white/5 text-muted'}`}
                >
                    <FileText className="w-4 h-4" />
                    Documents
                </button>
                <button
                    onClick={() => setMode('conversation')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'conversation' ? 'bg-[var(--glass-bg)] text-primary border-b-2 border-primary' : 'hover:bg-white/5 text-muted'}`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Conversation
                </button>
                <button
                    onClick={() => setMode('image')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors rounded-tr-xl ${mode === 'image' ? 'bg-[var(--glass-bg)] text-primary border-b-2 border-primary' : 'hover:bg-white/5 text-muted'}`}
                >
                    <ImageIcon className="w-4 h-4" />
                    Image
                </button>
            </div>

            {/* Header Bar within Card */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                <LanguageSelector
                    value={sourceLang}
                    onChange={setSourceLang}
                    options={languages}
                    side="left"
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-2 mr-1 rounded-full hover:bg-[var(--glass-input-bg)] text-muted hover:text-primary transition-colors"
                        title="View History"
                    >
                        <HistoryIcon className="w-4 h-4" />
                    </button>
                    {!apiKey && (
                        <button
                            onClick={() => setShowKeyInput(!showKeyInput)}
                            className="p-2 rounded-full hover:bg-[var(--glass-input-bg)] text-muted hover:text-primary transition-colors"
                            title="Set API Key"
                        >
                            <Key className="w-4 h-4" />
                        </button>
                    )}
                    {mode !== 'conversation' && (
                        <Button onClick={mode === 'text' ? handleTranslate : handleDocumentTranslate} isLoading={isTranslating} className="!px-6 !py-2 !text-sm">
                            {mode === 'text' ? 'Translate' : mode === 'image' ? 'Scan & Translate' : 'Upload & Translate'}
                        </Button>
                    )}
                </div>
                <LanguageSelector
                    value={targetLang}
                    onChange={setTargetLang}
                    options={languages}
                    side="right"
                />
            </div>

            <div className={`grid ${mode === 'conversation' ? 'grid-cols-1' : 'md:grid-cols-2'} divide-y md:divide-y-0 md:divide-x divide-[var(--glass-border)] bg-gradient-to-b from-transparent to-black/5`}>
                {mode === 'conversation' ? (
                    <ConversationView
                        sourceLang={sourceLang}
                        targetLang={targetLang}
                        languages={languages}
                        apiKey={apiKey}
                    />
                ) : (
                    <>
                        <div className="p-6 relative min-h-[300px]">
                            {mode === 'image' ? (
                                <ImageView
                                    selectedFile={selectedFile}
                                    onImageSelected={setSelectedFile}
                                    clearFile={() => setSelectedFile(null)}
                                />
                            ) : mode === 'text' ? (
                                <>
                                    <TextArea
                                        label="Input"
                                        placeholder="Type something to translate..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <div className="absolute bottom-8 right-8 z-10">
                                        <SpeechInput onSpeechInput={(text) => setInputText(text)} lang={sourceLang} />
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--glass-border)] rounded-2xl hover:border-primary/50 transition-colors bg-[var(--glass-input-bg)] group">
                                    <input
                                        type="file"
                                        id="doc-upload"
                                        className="hidden"
                                        accept=".pdf,.txt"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="doc-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-8">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-medium text-main mb-2">
                                            {selectedFile ? selectedFile.name : 'Choose a file'}
                                        </h3>
                                        <p className="text-sm text-muted text-center max-w-xs">
                                            {selectedFile ? 'Ready to translate' : 'Upload .pdf or .txt file (max 5MB)'}
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="p-6 relative">
                            {/* subtle loading overlay for output */}
                            {isTranslating && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-void/50 backdrop-blur-sm rounded-xl">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s] mx-1" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                </div>
                            )}
                            <TextArea
                                label="Output"
                                placeholder="Translation will appear here..."
                                value={translatedText}
                                readOnly
                                className="!bg-transparent !border-none !shadow-none font-light"
                            />
                            <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2">
                                {translatedText && (
                                    <>
                                        <button
                                            onClick={handleStar}
                                            className="p-3 rounded-full bg-black/10 backdrop-blur-md border border-white/5 text-muted hover:text-yellow-400 transition-colors"
                                            title="Save Translation"
                                        >
                                            <Star className="w-5 h-5" />
                                        </button>
                                        <TextToSpeech text={translatedText} lang={targetLang} />
                                        <CopyButton text={translatedText} />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <HistorySidebar
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onRestore={(item) => {
                    setInputText(item.original);
                    setTranslatedText(item.translated);
                    setSourceLang(item.fromLang);
                    setTargetLang(item.toLang);
                    setShowHistory(false);
                }}
            />
        </motion.div>
    );
};

const SpeechInput = ({ onSpeechInput, lang }: { onSpeechInput: (text: string) => void, lang: string }) => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        if (isListening) {
            window.speechSynthesis.cancel(); // Stop any speaking if happening
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onSpeechInput(transcript);
        };

        recognition.start();
    };

    return (
        <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-300 ${isListening
                ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-main'
                }`}
            title="Speak to type"
        >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
    );
};

const CopyButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleCopy}
                className="p-3 rounded-full bg-black/10 backdrop-blur-md border border-white/5 text-muted hover:text-main hover:bg-white/10 transition-colors"
                title="Copy translation"
            >
                {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
            <AnimatePresence>
                {isCopied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap border border-white/10"
                    >
                        Copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TextToSpeech = ({ text, lang }: { text: string, lang: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 0.75, 1, 1.25

    const handlePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = speed;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const cycleSpeed = () => {
        if (speed === 1) setSpeed(1.25);
        else if (speed === 1.25) setSpeed(0.75);
        else setSpeed(1);
    };

    return (
        <div className="flex items-center gap-2 bg-black/10 backdrop-blur-md rounded-full p-1 border border-white/5">
            <button
                onClick={handlePlay}
                className={`p-2 rounded-full transition-colors ${isPlaying ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-muted hover:text-main'}`}
                title={isPlaying ? "Stop" : "Listen"}
            >
                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
                onClick={cycleSpeed}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-muted hover:text-main hover:bg-white/10 transition-colors"
                title="Playback Speed"
            >
                <Gauge className="w-3 h-3" />
                {speed}x
            </button>
        </div>
    );
};
