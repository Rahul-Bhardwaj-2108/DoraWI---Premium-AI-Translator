import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-white/5 border border-white/10 text-muted hover:text-main hover:bg-white/10 transition-colors overflow-hidden group"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-2"
            >
                <Moon className="w-5 h-5 fill-current" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? 0 : -180,
                    scale: theme === 'light' ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Placeholder to keep size, absolute icons overlay it */}
                <Sun className="w-5 h-5 opacity-0" />

                <div className="absolute inset-2">
                    <Sun className="w-5 h-5 fill-current" />
                </div>
            </motion.div>
        </button>
    );
};
