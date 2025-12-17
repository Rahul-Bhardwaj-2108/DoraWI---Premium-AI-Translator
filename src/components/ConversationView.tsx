import React, { useState, useRef, useEffect } from 'react';
import { Mic, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    translatedText: string;
    sender: 'user' | 'partner'; // user = sourceLang, partner = targetLang
    lang: string;
}

interface ConversationViewProps {
    sourceLang: string;
    targetLang: string;
    languages: { code: string; name: string }[];
    apiKey: string;
}

export const ConversationView: React.FC<ConversationViewProps> = ({ sourceLang, targetLang, languages, apiKey }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [listeningTo, setListeningTo] = useState<'user' | 'partner' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for speech recognition management
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setListeningTo(null);
    };

    const speakText = (text: string, lang: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    };

    const handleSpeechResult = async (transcript: string, speaker: 'user' | 'partner') => {
        stopListening(); // Stop listening once we get a result to process it
        if (!transcript.trim()) return;

        setIsProcessing(true);

        const fromLang = speaker === 'user' ? sourceLang : targetLang;
        const toLang = speaker === 'user' ? targetLang : sourceLang;

        try {
            // Translate
            let translated = "";
            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const sourceName = languages.find(l => l.code === fromLang)?.name || fromLang;
                const targetName = languages.find(l => l.code === toLang)?.name || toLang;

                const prompt = `Translate the following conversational text from ${sourceName} to ${targetName}. Return ONLY the translation.\n\nText: ${transcript}`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                });
                translated = response.text || "";
            } else {
                translated = "[API Key Required]";
            }

            const newMessage: Message = {
                id: Date.now().toString(),
                text: transcript,
                translatedText: translated,
                sender: speaker,
                lang: fromLang
            };

            setMessages(prev => [...prev, newMessage]);

            // Auto-play translation
            if (translated && translated !== "[API Key Required]") {
                speakText(translated, toLang);
            }

        } catch (error) {
            console.error("Conversation translation error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const startListening = (speaker: 'user' | 'partner') => {
        if (listeningTo) {
            stopListening();
            if (listeningTo === speaker) return; // Toggle off
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = speaker === 'user' ? sourceLang : targetLang;
        // Continuous false so we process sentence by sentence
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListeningTo(speaker);
        recognition.onend = () => setListeningTo(null);
        recognition.onerror = (event: any) => {
            console.error("Speech error", event.error);
            setListeningTo(null);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            handleSpeechResult(transcript, speaker);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const clearHistory = () => {
        if (window.confirm("Clear conversation history?")) {
            setMessages([]);
        }
    };

    const getLangName = (code: string) => languages.find(l => l.code === code)?.name || code;

    return (
        <div className="flex flex-col h-[500px] relative">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted/50">
                        <p>Tap a microphone to start talking</p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                ? 'bg-primary/20 rounded-br-none border border-primary/20'
                                : 'bg-[var(--glass-input-bg)] rounded-bl-none border border-[var(--glass-border)]'
                                }`}>
                                <p className="text-sm text-main/90 mb-1">{msg.text}</p>
                                <p className={`text-lg font-medium ${msg.sender === 'user' ? 'text-primary' : 'text-blue-500'}`}>
                                    {msg.translatedText}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isProcessing && (
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl absolute bottom-0 w-full rounded-b-3xl">
                <div className="flex items-center justify-center gap-8 relative">

                    {/* Clear Button */}
                    <button
                        onClick={clearHistory}
                        className="absolute left-4 p-2 text-muted hover:text-red-400 transition-colors"
                        title="Clear Conversation"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Source Mic (User) */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-medium text-muted uppercase tracking-wider">{getLangName(sourceLang)}</span>
                        <button
                            onClick={() => startListening('user')}
                            disabled={isProcessing || (listeningTo !== null && listeningTo !== 'user')}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${listeningTo === 'user'
                                ? 'bg-primary text-primary-foreground scale-110 shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]'
                                : 'bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-muted hover:text-main hover:bg-primary/10 hover:border-primary/50'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {listeningTo === 'user' ? <Mic className="w-8 h-8 animate-pulse" /> : <Mic className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Target Mic (Partner) */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-medium text-muted uppercase tracking-wider">{getLangName(targetLang)}</span>
                        <button
                            onClick={() => startListening('partner')}
                            disabled={isProcessing || (listeningTo !== null && listeningTo !== 'partner')}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${listeningTo === 'partner'
                                ? 'bg-blue-500 text-white scale-110 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                                : 'bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-muted hover:text-main hover:bg-blue-500/10 hover:border-blue-500/50'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {listeningTo === 'partner' ? <Mic className="w-8 h-8 animate-pulse" /> : <Mic className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
