import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, Loader2, Copy } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface HistoryItem {
    _id?: string;
    original: string;
    translated: string;
    fromLang: string;
    toLang: string;
    createdAt: string;
}

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore: (item: HistoryItem) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onRestore }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(`${API_BASE_URL}/api/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-void border-l border-[var(--glass-border)] z-50 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-main">History</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-[var(--glass-input-bg)] text-muted hover:text-main transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-40">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center text-muted py-12">
                                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No translation history yet</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => onRestore(item)}
                                        className="group p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-input-bg)] hover:bg-[var(--glass-bg)] hover:border-primary/50 transition-all cursor-pointer relative"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted mb-2">
                                            <span className="uppercase">{item.fromLang}</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span className="uppercase">{item.toLang}</span>
                                            <span className="ml-auto text-[10px] opacity-70">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid gap-2">
                                            <p className="text-main line-clamp-2 text-sm">{item.original}</p>
                                            <p className="text-primary line-clamp-2 text-sm font-medium">{item.translated}</p>
                                        </div>

                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Copy className="w-4 h-4 text-muted hover:text-primary" />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
