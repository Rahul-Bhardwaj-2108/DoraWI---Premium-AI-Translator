import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options: { code: string; name: string }[];
    side: 'left' | 'right';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, options, side }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel hover:bg-white/10 transition-colors text-sm font-medium"
            >
                {options.find(o => o.code === value)?.name || value}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute z-20 ${side === 'left' ? 'left-0' : 'right-0'} mt-2 w-48 max-h-[300px] py-2 rounded-xl glass-panel bg-void/90 shadow-xl border border-white/5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}
                    >
                        {options.map((option) => (
                            <button
                                key={option.code}
                                onClick={() => {
                                    onChange(option.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-primary/20 hover:text-primary transition-colors ${value === option.code ? 'text-primary bg-primary/10' : 'text-muted'}`}
                            >
                                {option.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
