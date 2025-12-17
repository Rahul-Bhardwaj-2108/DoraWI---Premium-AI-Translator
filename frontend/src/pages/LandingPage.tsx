import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, FileText, Type, Image as ImageIcon, ArrowRight, Globe, ShieldCheck, Zap, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { Button } from '../components/ui/Button';
import { useState } from 'react';

export const LandingPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const features = [
        {
            icon: <Type className="w-8 h-8 text-blue-400" />,
            title: "Smart Text Translation",
            description: "Translate text instantly between 100+ languages with nuance-aware AI.",
            gradient: "from-blue-500/10 to-cyan-500/10"
        },
        {
            icon: <FileText className="w-8 h-8 text-purple-400" />,
            title: "Document Translation",
            description: "Upload PDF or TXT files and get them translated while keeping the formatting.",
            gradient: "from-purple-500/10 to-pink-500/10"
        },
        {
            icon: <Mic className="w-8 h-8 text-green-400" />,
            title: "Conversation Mode",
            description: "Break language barriers in real-time with split-mic conversational AI.",
            gradient: "from-green-500/10 to-emerald-500/10"
        },
        {
            icon: <ImageIcon className="w-8 h-8 text-orange-400" />,
            title: "Image Translation",
            description: "Point your camera or upload an image to extract and translate text instantly.",
            gradient: "from-orange-500/10 to-yellow-500/10"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-primary/30">
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/70 border-b border-[var(--glass-border)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                            <img src="/logo.png" alt="DoraWi Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">DoraWi</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeSwitcher />
                        {token ? (
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="!px-6 !py-2 !text-sm !shadow-none"
                            >
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-muted hover:text-[var(--text-primary)] transition-colors px-4 py-2"
                                >
                                    Sign In
                                </button>
                                <Button
                                    onClick={() => navigate('/signup')}
                                    className="!px-6 !py-2 !text-sm !shadow-none"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-muted hover:text-[var(--text-primary)] transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-[var(--glass-border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="p-6 flex flex-col gap-4">
                                {token ? (
                                    <Button
                                        onClick={() => {
                                            navigate('/dashboard');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="!w-full !py-3 !text-sm !shadow-none"
                                    >
                                        Go to Dashboard
                                    </Button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full p-3 text-center text-sm font-medium text-muted hover:text-[var(--text-primary)] hover:bg-[var(--glass-input-bg)] rounded-lg transition-all"
                                        >
                                            Sign In
                                        </button>
                                        <Button
                                            onClick={() => {
                                                navigate('/signup');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="!w-full !py-3 !text-sm !shadow-none"
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-input-bg)] border border-[var(--glass-border)] mb-8 backdrop-blur-sm">
                            <Globe className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-medium text-[var(--text-secondary)] italic">"To have another language is to possess a second soul."</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
                            Breaking Language <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Barriers Forever
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                            Experience the future of communication. Translate text, documents, images, and conversations in real-time with our advanced AI-powered platform.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => navigate(token ? '/dashboard' : '/signup')}
                                className="!px-8 !py-4 !text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 w-full sm:w-auto"
                            >
                                {token ? 'Go to Dashboard' : 'Start Translating Now'} <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
                        <p className="text-muted text-lg">Four powerful modes in one simple interface.</p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className={`p-8 rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)]/50 hover:shadow-[0_0_40px_-10px_var(--accent-primary)]`}
                            >
                                <div className="mb-6 p-4 rounded-2xl bg-[var(--glass-input-bg)] w-fit border border-[var(--glass-border)]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trust/Stats Section */}
            <section className="py-20 px-6 border-y border-[var(--glass-border)] bg-[var(--glass-input-bg)]/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-12">
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-blue-500/10 mb-4 text-blue-400">
                            <Globe className="w-8 h-8" />
                        </div>
                        <h4 className="text-4xl font-bold mb-1">100+</h4>
                        <span className="text-muted">Languages Supported</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-emerald-500/10 mb-4 text-emerald-400">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h4 className="text-4xl font-bold mb-1">0.5s</h4>
                        <span className="text-muted">Average Latency</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 rounded-full bg-purple-500/10 mb-4 text-purple-400">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h4 className="text-4xl font-bold mb-1">Secure</h4>
                        <span className="text-muted">Private & Encrypted</span>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-[var(--glass-input-bg)] to-transparent border border-[var(--glass-border)] relative overflow-hidden"
                >
                    <div className="absolute top-0 flex w-full justify-center">
                        <div className="left-0 h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-[var(--accent-primary)] to-[rgba(17,17,17,0)] transition-all duration-1000" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to break barriers?</h2>
                        <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
                            Join thousands of users communicating without limits. Create your free account today.
                        </p>
                        <div className="flex justify-center">
                            <Button
                                onClick={() => navigate(token ? '/dashboard' : '/signup')}
                                className="!px-10 !py-4 !text-lg !rounded-2xl w-full sm:w-auto"
                            >
                                {token ? 'Go to Dashboard' : 'Get Started for Free'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-[var(--glass-border)] text-center text-muted text-sm">
                <p>&copy; {new Date().getFullYear()} DoraWi. All rights reserved.</p>
            </footer>
        </div>
    );
};
