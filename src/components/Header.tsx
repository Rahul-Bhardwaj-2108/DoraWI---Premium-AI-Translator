import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="py-6 flex items-center justify-between">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
            >
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                    <img src="/logo.png" alt="DoraWi Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
                    DoraWi
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
            >
                <ThemeSwitcher />
                <button
                    onClick={() => navigate('/profile')}
                    className="rounded-full bg-white/5 border border-white/10 text-muted hover:text-main hover:bg-white/10 transition-colors w-10 h-10 flex items-center justify-center overflow-hidden shrink-0"
                    title="User Profile & Settings"
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-4 h-4" />
                    )}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted hover:text-main hover:bg-white/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </motion.div>
        </header>
    );
};
