import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Activity, Save, ArrowLeft, Languages, Type, Camera, Upload, X, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const Dashboard = () => {
    const [stats, setStats] = useState<any>({ totalTranslations: 0, topLanguages: [], wordsTranslated: 0 });
    const [profile, setProfile] = useState<any>({ username: '', email: '', avatar: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 400; // Resize to max 400px

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await resizeImage(file);
            setProfile({ ...profile, avatar: base64 });
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (err) {
            setMessage('Could not access camera');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);

            // Resize captured photo too
            const img = new Image();
            img.onload = () => {
                const resizedCanvas = document.createElement('canvas');
                const ctx2 = resizedCanvas.getContext('2d');
                const maxSize = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                resizedCanvas.width = width;
                resizedCanvas.height = height;
                ctx2?.drawImage(img, 0, 0, width, height);
                setProfile({ ...profile, avatar: resizedCanvas.toDataURL('image/jpeg', 0.8) });
                stopCamera();
            };
            img.src = canvas.toDataURL('image/jpeg');
        }
    };

    // Effect to attach stream to video element when camera opens
    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [showCamera, stream]);

    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [statsRes, profileRes, favRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/user/stats`, config),
                axios.get(`${API_BASE_URL}/api/user/profile`, config),
                axios.get(`${API_BASE_URL}/api/favorites`, config)
            ]);
            setStats(statsRes.data);
            setProfile(profileRes.data);
            setFavorites(favRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFavorite = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/favorites/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(f => f._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const updateProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/user/profile`, { avatar: profile.avatar }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update localStorage specifically for avatar functionality
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, avatar: profile.avatar }));

            setMessage('Profile updated!');
            setTimeout(() => {
                setMessage('');
                // Force reload/re-render to show new avatar in header immediately
                window.location.reload();
            }, 1000);
        } catch (err) {
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/user/password`, {
                currentPassword: passwords.current,
                newPassword: passwords.new
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Password changed successfully');
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-main p-6 sm:p-12 relative overflow-hidden transition-colors duration-500">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 rounded-full hover:bg-[var(--glass-input-bg)] text-muted hover:text-primary transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-light">Dashboard</h1>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-center">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat Cards */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Total Translations</p>
                            <p className="text-2xl font-semibold text-main">{stats.totalTranslations}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                            <Languages className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Top Languages</p>
                            <div className="flex gap-2 mt-1">
                                {stats.topLanguages.map((l: any) => (
                                    <span key={l.code} className="text-xs px-2 py-0.5 rounded bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] uppercase text-main">{l.code}</span>
                                ))}
                                {stats.topLanguages.length === 0 && <span className="text-xs text-muted">None yet</span>}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                            <Type className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Est. Words Translated</p>
                            <p className="text-2xl font-semibold text-main">{stats.wordsTranslated}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Section */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-medium text-main">Profile Settings</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-[var(--glass-input-bg)] border border-[var(--glass-border)] overflow-hidden flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-muted" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <label className="text-xs text-muted uppercase font-medium">Update Photo</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] text-sm hover:bg-[var(--glass-border)] transition-colors text-main"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload
                                        </button>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />

                                        <button
                                            onClick={startCamera}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] text-sm hover:bg-[var(--glass-border)] transition-colors text-main"
                                        >
                                            <Camera className="w-4 h-4" />
                                            Camera
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-muted uppercase font-medium mb-1 block">Username</label>
                                <input type="text" value={profile.username} disabled className="w-full bg-[var(--glass-input-bg)] border border-transparent rounded-xl py-3 px-4 text-sm text-muted cursor-not-allowed" />
                            </div>

                            <div>
                                <label className="text-xs text-muted uppercase font-medium mb-1 block">Email</label>
                                <input type="text" value={profile.email} disabled className="w-full bg-[var(--glass-input-bg)] border border-transparent rounded-xl py-3 px-4 text-sm text-muted cursor-not-allowed" />
                            </div>

                            <Button onClick={updateProfile} isLoading={loading} className="w-full">
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </Button>
                        </div>
                    </motion.div>

                    {/* Security Section */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-medium text-main">Security</h2>
                        </div>

                        <form onSubmit={changePassword} className="space-y-4">
                            <div>
                                <label className="text-xs text-muted uppercase font-medium mb-1 block">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-main placeholder-muted"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted uppercase font-medium mb-1 block">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-main placeholder-muted"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted uppercase font-medium mb-1 block">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full bg-[var(--glass-input-bg)] border border-[var(--glass-input-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-main placeholder-muted"
                                    required
                                />
                            </div>

                            <Button type="submit" isLoading={loading} className="w-full mt-2">
                                Change Password
                            </Button>
                        </form>
                    </motion.div>
                </div>

                {/* Saved Translations */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-xl font-medium text-main">Saved Translations</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.length === 0 ? (
                            <div className="col-span-full p-8 rounded-2xl glass-panel text-center text-muted">
                                No saved translations yet. Star some phrases!
                            </div>
                        ) : (
                            favorites.map((fav) => (
                                <motion.div
                                    key={fav._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-panel p-5 rounded-2xl flex flex-col gap-3 group relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <span className="text-xs uppercase bg-[var(--glass-input-bg)] py-1 px-2 rounded text-main">{fav.fromLang}</span>
                                            <span className="text-muted">→</span>
                                            <span className="text-xs uppercase bg-primary/20 text-primary py-1 px-2 rounded">{fav.toLang}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFavorite(fav._id)}
                                            className="text-muted hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-main mb-1 text-lg">{fav.translated}</p>
                                        <p className="text-sm text-muted line-clamp-2">{fav.original}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Camera Overlay */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-2xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-auto aspect-[4/3] object-cover bg-neutral-900"
                            />

                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                                <button
                                    onClick={stopCamera}
                                    className="p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={capturePhoto}
                                    className="p-3 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Capture
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
