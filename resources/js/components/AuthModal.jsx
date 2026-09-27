import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, Sparkles, LogIn } from 'lucide-react';

export const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, login, register } = useAuth();
    const { showToast } = useCart();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (authModalTab === 'login') {
                const user = await login(email, password);
                showToast(`Welcome back, ${user.name}!`, 'success');
            } else {
                const user = await register({ name, email, password, phone });
                showToast(`Welcome to SUVARX, ${user.name}!`, 'success');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Authentication failed. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (demoRole) => {
        setError('');
        setLoading(true);
        try {
            if (demoRole === 'admin') {
                await login('admin@m3s.com', 'admin123');
                showToast('Logged in as Administrator', 'success');
            } else {
                await login('customer@example.com', 'password');
                showToast('Logged in as Customer', 'success');
            }
        } catch (err) {
            setError('Demo login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden relative">
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow-md">
                            SVX
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {authModalTab === 'login' ? 'Welcome Back' : 'Create an Account'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {authModalTab === 'login' 
                                ? 'Sign in to access your orders and account settings' 
                                : 'Join SUVARX for faster checkout and exclusive offers'}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => { setAuthModalTab('login'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                authModalTab === 'login'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthModalTab('register'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                authModalTab === 'register'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {authModalTab === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Morgan"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {authModalTab === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    {authModalTab === 'login' ? 'Sign In to Store' : 'Create Account'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Logins */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
                            Instant 1-Click Demo Login
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('customer')}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Customer Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
