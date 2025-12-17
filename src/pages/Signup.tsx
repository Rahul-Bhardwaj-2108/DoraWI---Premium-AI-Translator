import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const InputField = ({ icon: Icon, type, placeholder, value, onChange }: any) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-main transition-colors">
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-void-light border border-white/10 rounded-xl py-4 pl-12 pr-4 text-main placeholder-muted/50 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all font-light"
            required
        />
    </div>
);

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { username, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Force reload to update App.tsx auth state
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-void">
            {/* Background Ambience matches Layout */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel w-full max-w-md p-8 rounded-3xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight text-main mb-2">Create Account</h1>
                    <p className="text-muted font-light">Join DoraWi to start translating</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <InputField
                        icon={User}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e: any) => setUsername(e.target.value)}
                    />
                    <InputField
                        icon={Mail}
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                    />
                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-medium py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-main hover:underline decoration-primary">
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
