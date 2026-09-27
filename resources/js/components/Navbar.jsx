import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
    ShoppingBag, 
    Search, 
    User, 
    X, 
    Shield, 
    Layers,
    ChevronDown,
    ArrowRight,
    Sparkles,
    FolderOpen
} from 'lucide-react';

export const Navbar = () => {
    const { totalItems, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const { settings, activeCurrency, toggleCurrency } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    // Fetch collections/categories from API
    useEffect(() => {
        axios.get('/api/categories')
            .then(res => {
                setCategories(res.data || []);
            })
            .catch(err => console.error('Failed to load categories', err));
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
        }
    };

    return (
        <>
            {/* Top Laser Progress Bar */}
            <div className="fixed top-0 inset-x-0 h-[2px] z-50 bg-gradient-to-r from-transparent via-pink-500/80 to-transparent shadow-[0_0_12px_rgba(236,72,153,0.8)]" />

            {/* Camera Viewfinder HUD Frame Brackets (Fixed on All 4 Corners) */}
            <div className="fixed inset-0 pointer-events-none z-30 select-none">
                <div className="absolute top-4 left-4 font-mono text-sm text-white/40">┌</div>
                <div className="absolute top-4 right-4 font-mono text-sm text-white/40">┐</div>
                <div className="absolute bottom-4 left-4 font-mono text-sm text-white/40">└</div>
                <div className="absolute bottom-4 right-4 font-mono text-sm text-white/40">┘</div>
            </div>

            {/* Floating HUD Header */}
            <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between pointer-events-auto select-none transition-colors duration-300 bg-gradient-to-b from-[#0A0A0C]/90 via-[#0A0A0C]/40 to-transparent text-white">
                {/* Left: Collections & Currency & Search */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Direct Collection / All Products Link */}
                    <Link
                        to="/shop"
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-mono font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer bg-white/10 hover:bg-white/20 border-white/15 text-white hover:border-pink-500/50 hover:text-pink-300"
                        title="View All Products"
                    >
                        <Layers className="w-3.5 h-3.5 text-pink-400" />
                        <span>COLLECTION</span>
                    </Link>

                    {/* Currency Toggle */}
                    <select
                        value={activeCurrency}
                        onChange={(e) => toggleCurrency(e.target.value)}
                        className="appearance-none bg-transparent outline-none cursor-pointer px-3 py-1.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider transition-all border backdrop-blur-md bg-white/10 text-white border-white/15 hover:bg-white/20"
                        title="Select Currency"
                    >
                        <option value="BDT" className="text-black bg-white">৳ BDT</option>
                        <option value="USD" className="text-black bg-white">$ USD</option>
                        <option value="GBP" className="text-black bg-white">£ GBP</option>
                    </select>

                    {/* Search Chip */}
                    <button
                        type="button"
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all hover:bg-white/10 text-zinc-400 hover:text-white"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase">Search</span>
                    </button>
                </div>

                {/* Center: Brand Logo with Spinning Decorative Chrome Ring Underneath */}
                <div className="flex flex-col items-center group relative">
                    {/* Light white gradient background behind logo for visibility */}
                    {settings?.header_logo && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-16 sm:h-24 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.85)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none -z-10 blur-sm rounded-full" />
                    )}
                    <Link to="/" className="flex items-center gap-1.5 relative z-10">
                        {settings?.header_logo ? (
                            <img src={settings.header_logo} alt="Brand Logo" className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <span
                                className="ciao-title tracking-tighter transition-transform group-hover:scale-105 drop-shadow-[0_2px_20px_rgba(168,85,247,0.7)]"
                                style={{
                                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                                    color: '#ffffff',
                                    textShadow: '0 0 30px rgba(168,85,247,0.8), 0 0 60px rgba(99,102,241,0.4)',
                                }}
                            >
                                SUVARX
                            </span>
                        )}
                    </Link>

                    {/* Spinning Decorative Portal Ring */}
                    <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 opacity-60 blur-[1px] animate-pulse -mt-1" />
                </div>

                {/* Right: Menu & Glowing Bag Button */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Menu Chip */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest transition-all border backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/15"
                    >
                        <span className="text-zinc-500">::</span>
                        <span className="hidden sm:inline">MENU</span>
                    </button>

                    {/* Contact / Bag Button */}
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="px-4 sm:px-6 py-1.5 sm:py-2 font-extrabold text-xs uppercase tracking-wider rounded-full transition-all active:scale-95 flex items-center gap-2 bg-white text-black hover:bg-zinc-200 shadow-glow-white"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>BAG ({totalItems})</span>
                    </button>
                </div>
            </header>

            {/* Search Modal Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="border border-white/15 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 bg-[#111116] text-white">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <span className="text-xs font-mono font-bold uppercase text-zinc-400">Search Car Accessories</span>
                            <button onClick={() => setSearchOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Vintage Black, Oversized, Acid Wash..."
                                className="flex-1 px-4 py-3 border border-white/15 rounded-2xl text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-2 bg-black/50 text-white focus:ring-white"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 font-extrabold text-xs rounded-2xl uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Full-Screen Cyber Menu Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
                    <div 
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative w-full max-w-md border-l border-white/10 h-full p-8 flex flex-col justify-between z-10 shadow-2xl animate-slide-left bg-[#0A0A0C] text-white overflow-y-auto">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    {settings?.header_logo ? (
                                        <img src={settings.header_logo} alt="Brand Logo" className="h-6 w-auto object-contain" />
                                    ) : (
                                        <span
                                            className="ciao-title text-xl"
                                            style={{
                                                color: '#ffffff',
                                                textShadow: '0 0 20px rgba(168,85,247,0.8)',
                                            }}
                                        >
                                            SUVARX
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Main Navigation */}
                            <nav className="flex flex-col gap-4 text-lg font-extrabold uppercase font-heading">
                                <Link to="/" className="hover:text-pink-400 transition-colors py-1 flex items-center justify-between">
                                    <span>01. 3D Home Story</span>
                                    <span className="text-xs font-mono text-zinc-500">→</span>
                                </Link>
                                <Link to="/shop" className="hover:text-pink-400 transition-colors py-1 flex items-center justify-between">
                                    <span>02. All Drops</span>
                                    <span className="text-xs font-mono text-zinc-500">→</span>
                                </Link>
                                
                                {/* Collections heading in mobile */}
                                <div className="pt-2 border-t border-white/10">
                                    <span className="text-[10px] font-mono text-pink-400 tracking-widest uppercase block mb-2">
                                        Collections
                                    </span>
                                    <div className="space-y-2">
                                        {categories.map((c) => (
                                            <Link 
                                                key={c.id} 
                                                to={`/shop?category=${c.id}`}
                                                className="hover:text-pink-400 transition-colors py-1 flex items-center justify-between text-sm text-zinc-300"
                                            >
                                                <span>{c.name}</span>
                                                <span className="text-[10px] font-mono text-zinc-500">
                                                    {c.products_count !== undefined ? `${c.products_count}` : '→'}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <Link to="/track-order" className="hover:text-pink-400 transition-colors py-1 flex items-center justify-between text-base text-zinc-400 border-t border-white/10 pt-3">
                                    <span>Track Order</span>
                                    <span className="text-xs font-mono text-zinc-500">→</span>
                                </Link>
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-2 text-xs text-zinc-500 font-mono">
                            <p>PREMIUM CAR ACCESSORIES</p>
                            <p>DHAKA • NATIONWIDE DELIVERY</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
