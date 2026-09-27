import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Package, 
    Layers, 
    Award, 
    ShoppingCart, 
    Users, 
    Image, 
    Tag, 
    MessageSquare, 
    Settings, 
    LogOut, 
    ExternalLink, 
    Menu, 
    X,
    Bell,
    ChevronDown,
    Search,
    BookOpen,
    HelpCircle
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: Award },
    { name: 'Home Benefits', path: '/admin/benefits', icon: BookOpen },
    { name: 'Home FAQ', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Banners & Sliders', path: '/admin/banners', icon: Image },
    { name: 'Coupons & Promo', path: '/admin/coupons', icon: Tag },
    { name: 'Reviews Moderation', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
    const { user, login, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);
        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser.role !== 'admin') {
                setLoginError('Access denied. Admin only.');
                logout();
            }
        } catch (err) {
            setLoginError('Invalid credentials');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4">
                <div className="bg-[#111116] p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/10 text-white animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white text-black font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            M3S
                        </div>
                        <h1 className="text-2xl font-extrabold">Admin CMS Portal</h1>
                        <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider font-mono">Restricted Access</p>
                    </div>

                    {loginError && (
                        <div className="mb-6 p-3 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl border border-red-500/20 text-center">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">Admin Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm placeholder:text-zinc-600" 
                                placeholder="admin@m3s.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm placeholder:text-zinc-600" 
                                placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoggingIn}
                            className="w-full py-3 mt-4 bg-white text-black font-extrabold uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {isLoggingIn ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>
                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <Link to="/" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                            &larr; Return to Storefront
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 antialiased font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        CMS
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">M3S Admin Panel</span>
                </div>

                <Link to="/" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    Storefront <ExternalLink className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            }`}>
                {/* Brand Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                            M3S
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-900 text-base block leading-tight">Admin CMS</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Control Panel</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Link to Storefront */}
                <div className="p-4 pb-2">
                    <Link
                        to="/"
                        target="_blank"
                        className="w-full py-2 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-between border border-slate-200 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Storefront
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    active
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Profile & Logout Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block truncate">{user?.name || 'Admin'}</span>
                                <span className="text-[10px] text-slate-400 truncate block">{user?.email || 'admin@m3s.com'}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Body */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Desktop Topbar */}
                <header className="hidden lg:flex items-center justify-between h-16 bg-white border-b border-slate-200/80 px-8 sticky top-0 z-30 shadow-subtle">
                    <div className="text-xs font-semibold text-slate-500">
                        Admin Control Management System & Live Analytics
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            target="_blank"
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Store
                        </Link>
                    </div>
                </header>

                {/* Page View Outlet */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
