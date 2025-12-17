import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { TranslatorCard } from './components/TranslatorCard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* Public Route: Landing Page (Redirects to dashboard if logged in) */}
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Dashboard Route */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <div className="min-h-screen">
                                    <Header />
                                    <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                                        <div className="text-center mb-12">
                                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] mb-6 tracking-tight">
                                                Breaking Language Barriers
                                            </h1>
                                            <p className="text-lg text-muted max-w-2xl mx-auto font-light leading-relaxed">
                                                Experience seamless translation powered by advanced AI.
                                                Communicate globally with confidence and clarity.
                                            </p>
                                        </div>

                                        <TranslatorCard />
                                    </main>
                                </div>
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* User Profile / Stats Dashboard */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
