import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    ShoppingBag, 
    Sparkles, 
    Feather, 
    Layers, 
    ShieldCheck, 
    RotateCcw, 

    X, 
    Check, 
    ArrowRight,
    HelpCircle,
    Info,
    Droplets,
    Scissors,
    Box,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeArcScene } from '../components/ThreeArcScene';
import { HeroBanner } from '../components/HeroBanner';

import axios from 'axios';

const aestheticThemes = [
    {
        colorMood: 'from-[#3b061d] via-[#1a020d] to-[#070709]',
        lightMood: 'from-[#ffeef6] via-[#fcf0f5] to-[#fafafa]',
        accentColor: '#FF1F7D',
        watermark: 'VINTAGE BLACK',
    },
    {
        colorMood: 'from-[#002670] via-[#051130] to-[#070709]',
        lightMood: 'from-[#eaf2ff] via-[#f2f6fc] to-[#fafafa]',
        accentColor: '#3B82F6',
        watermark: 'CYBER TOKYO',
    },
    {
        colorMood: 'from-[#113821] via-[#071c10] to-[#070709]',
        lightMood: 'from-[#edfcf2] via-[#f2fcf5] to-[#fafafa]',
        accentColor: '#10B981',
        watermark: 'ESSENTIAL BLANK',
    },
    {
        colorMood: 'from-[#38164a] via-[#16081e] to-[#070709]',
        lightMood: 'from-[#f9efff] via-[#f7f0fc] to-[#fafafa]',
        accentColor: '#A855F7',
        watermark: 'MINERAL ACID',
    },
    {
        colorMood: 'from-[#473003] via-[#1c1301] to-[#070709]',
        lightMood: 'from-[#fff8ea] via-[#fcf6ee] to-[#fafafa]',
        accentColor: '#F59E0B',
        watermark: 'LIMITED EDITION',
    }
];

// Helper to resolve Product Showcase background from product theme or dynamic settings
const getShowcaseBackground = (settings, activeDrop) => {
    // 1. Check if the active product drop has its own custom background configured
    if (activeDrop?.bg_type === 'image' && activeDrop?.bg_image) {
        return {
            backgroundImage: `url("${activeDrop.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }

    if (activeDrop?.bg_type === 'gradient' && activeDrop?.bg_gradient) {
        return {
            background: activeDrop.bg_gradient,
        };
    }

    if (activeDrop?.bg_type === 'color' && activeDrop?.bg_color) {
        return {
            backgroundColor: activeDrop.bg_color,
        };
    }

    if (activeDrop?.bg_gradient && activeDrop?.bg_type !== 'image') {
        return {
            background: activeDrop.bg_gradient,
        };
    }

    if (activeDrop?.bg_image && activeDrop?.bg_type !== 'gradient') {
        return {
            backgroundImage: `url("${activeDrop.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }

    // 2. Global fallback from Admin Showcase Settings
    const bgType = settings?.showcase_bg_type || 'image';

    if (bgType === 'color') {
        return {
            backgroundColor: settings?.showcase_bg_color || '#070709',
        };
    }

    if (bgType === 'gradient') {
        const rawGrad = settings?.showcase_bg_gradient || 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)';
        let gradientStyle = rawGrad;

        if (!rawGrad.startsWith('linear-gradient') && !rawGrad.startsWith('radial-gradient')) {
            if (rawGrad.includes('pink') || rawGrad.includes('cyan')) {
                gradientStyle = 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)';
            } else if (rawGrad.includes('slate') || rawGrad.includes('black')) {
                gradientStyle = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)';
            } else if (rawGrad.includes('emerald')) {
                gradientStyle = 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)';
            } else if (rawGrad.includes('amber') || rawGrad.includes('orange')) {
                gradientStyle = 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)';
            } else if (rawGrad.includes('crimson') || rawGrad.includes('3b061d')) {
                gradientStyle = 'linear-gradient(135deg, #6b0b2a 0%, #3b061d 50%, #070709 100%)';
            } else if (rawGrad.includes('violet') || rawGrad.includes('purple')) {
                gradientStyle = 'linear-gradient(135deg, #581c87 0%, #3b0764 50%, #090514 100%)';
            } else if (rawGrad.includes('blue') || rawGrad.includes('cobalt')) {
                gradientStyle = 'linear-gradient(135deg, #0369a1 0%, #1e3a8a 50%, #030712 100%)';
            } else {
                gradientStyle = 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)';
            }
        }

        return {
            background: gradientStyle,
        };
    }

    // Default: Image
    const imgUrl = settings?.showcase_bg_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    return {
        backgroundImage: `url("${imgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };
};

// Helper to resolve Product-specific background for Close-Up Detail & scenes
const getProductDropBackground = (drop, isDark) => {
    if (!drop) return {};

    if (drop.bg_type === 'image' && drop.bg_image) {
        return {
            backgroundImage: `url("${drop.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }

    if (drop.bg_type === 'gradient' && drop.bg_gradient) {
        return {
            background: drop.bg_gradient,
        };
    }

    if (drop.bg_type === 'color' && drop.bg_color) {
        return {
            backgroundColor: drop.bg_color,
        };
    }

    if (drop.bg_gradient && drop.bg_type !== 'image' && drop.bg_type !== 'color') {
        return {
            background: drop.bg_gradient,
        };
    }

    if (drop.bg_image && drop.bg_type !== 'gradient' && drop.bg_type !== 'color') {
        return {
            backgroundImage: `url("${drop.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }

    return {};
};

export const Home = () => {
    const { formatPrice, settings } = useSettings();
    const { addToCart, openCheckout } = useCart();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    // Step 1: Loading Screen State (<1.5s)
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // Step 2: 3D Arc State
    const [heroBanners, setHeroBanners] = useState([]);
    const [drops, setDrops] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTooltip, setActiveTooltip] = useState(null); // 'fabric' | 'fit' | 'print' | 'care'

    const [quantity, setQuantity] = useState(1);


    // Fetch Products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await axios.get('/api/home');
                const apiProducts = res.data.featuredProducts || [];
                
                // Map API products to aesthetic UI structure
                const mappedDrops = apiProducts.map((p, idx) => {
                    const theme = aestheticThemes[idx % aestheticThemes.length];
                    
                    // Parse title into Line 1, Line 2, and Subtitle
                    let sub = '';
                    let main = p.title || 'SUVARX PRODUCT';
                    if (main.includes('—')) {
                        const parts = main.split('—');
                        main = parts[0].trim();
                        sub = parts.slice(1).join('—').trim();
                    } else if (main.includes('-')) {
                        const parts = main.split('-');
                        main = parts[0].trim();
                        sub = parts.slice(1).join('-').trim();
                    }
                    const words = main.split(' ');
                    const line1 = words[0] ? words[0].toUpperCase() : 'SUVARX';
                    const line2 = words.slice(1).join(' ').toUpperCase() || 'CAR ACCESSORY';
                    const lineSub = sub ? sub.toUpperCase() : (p.category?.name ? `${p.category.name.toUpperCase()} — EDITION` : 'CAR ACCESSORIES — LIMITED EDITION');

                    return {
                        id: p.id,
                        name: line1,
                        subtitle: line2,
                        titleLine1: line1,
                        titleLine2: line2,
                        titleSub: lineSub,
                        fullTitle: p.title,
                        colorMood: p.theme_color_mood || theme.colorMood,
                        lightMood: p.theme_light_mood || theme.lightMood,
                        accentColor: theme.accentColor,
                        watermark: p.theme_watermark || theme.watermark,
                        bg_type: p.bg_type,
                        bg_image: p.bg_image,
                        bg_gradient: p.bg_gradient,
                        bg_color: p.bg_color,
                        image: p.thumbnail || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=90',
                        model_3d: p.model_3d,
                        model_scale: p.model_scale,
                        model_pos_x: p.model_pos_x,
                        model_pos_y: p.model_pos_y,
                        model_pos_z: p.model_pos_z,
                        model_rot_x: p.model_rot_x,
                        model_rot_y: p.model_rot_y,
                        model_rot_z: p.model_rot_z,
                        price: p.price,
                        slug: p.slug,
                        description: p.description || p.short_description || 'Forged in shadows. Inspired by legends. Wear the warrior within.',
                        specSheet: {
                            material: 'High-grade ABS Plastic',
                            fit: 'Universal vehicle fit',
                            print: 'HD resolution output',
                            care: 'Wipe clean with dry cloth'
                        }
                    };
                });
                
                setDrops(mappedDrops);
                setHeroBanners(res.data.banners || []);
            } catch (err) {
                console.error("Failed to load products", err);
            }
        };
        
        loadProducts();
    }, []);

    const activeDrop = drops[activeIndex] || {
        id: 0,
        name: '',
        subtitle: '',
        fullTitle: '',
        colorMood: 'from-zinc-900 via-zinc-800 to-black',
        lightMood: 'from-zinc-100 via-zinc-50 to-white',
        accentColor: '#888',
        watermark: '',
        image: '',
        price: 0,
        slug: '',
        description: '',
        specSheet: {
            fabric: '',
            fit: '',
            print: '',
            care: ''
        }
    };

    // Simulate Step 1 Loader on first load (< 1.5s)
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 200);
                    return 100;
                }
                return prev + 15;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const nextDrop = () => {
        setActiveIndex((prev) => (prev + 1) % drops.length);
        setActiveTooltip(null);
    };

    const prevDrop = () => {
        setActiveIndex((prev) => (prev - 1 + drops.length) % drops.length);
        setActiveTooltip(null);
    };

    const scrollToScene = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = () => {
        addToCart({
            id: activeDrop.id,
            title: activeDrop.fullTitle,
            price: activeDrop.price,
            thumbnail: activeDrop.image,
            slug: activeDrop.slug,
            category: { name: 'Car Accessories' }
        }, quantity, {

            color: activeDrop.subtitle
        });
    };

    const handleBuyNow = () => {
        openCheckout({
            id: activeDrop.id,
            title: activeDrop.fullTitle,
            price: activeDrop.price,
            thumbnail: activeDrop.image,
            slug: activeDrop.slug,
            category: { name: 'Auto & Lifestyle' }
        }, quantity, {

            color: activeDrop.subtitle
        });
    };

    return (
        <div className={`w-full selection:bg-white selection:text-black overflow-x-hidden transition-colors duration-300 ${
            isDark ? 'bg-[#070709] text-white' : 'bg-[#FAFAFA] text-[#111111]'
        }`}>
            {/* ========================================================================= */}
            {/* STEP 1: LOADING SCREEN (<1.5s Auto-Reveal)                                */}
            {/* ========================================================================= */}
            {isLoading && (
                <div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 40%, #0d0d14 0%, #050508 60%, #000000 100%)',
                    }}
                >
                    {/* ── Ambient floating orbs ── */}
                    <div className="suvarx-orb suvarx-orb-1" />
                    <div className="suvarx-orb suvarx-orb-2" />
                    <div className="suvarx-orb suvarx-orb-3" />

                    {/* ── Outer rotating ring ── */}
                    <div className="suvarx-ring suvarx-ring-outer" />
                    {/* ── Inner rotating ring (reverse) ── */}
                    <div className="suvarx-ring suvarx-ring-inner" />
                    {/* ── Spinning dashed ring ── */}
                    <div className="suvarx-ring suvarx-ring-dash" />

                    {/* ── Core content ── */}
                    <div className="relative flex flex-col items-center gap-5">

                        {/* Brand logotype */}
                        {settings?.loading_logo ? (
                            <img
                                src={settings.loading_logo}
                                alt="Suvarx"
                                className="h-24 sm:h-36 w-auto object-contain suvarx-logo-fade"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                {/* SUVARX — single full wordmark, big & clear */}
                                <span
                                    className="suvarx-wordmark"
                                    style={{
                                        fontFamily: "'Anton', sans-serif",
                                        fontStyle: 'italic',
                                        fontWeight: 900,
                                        fontSize: 'clamp(5rem, 18vw, 9rem)',
                                        letterSpacing: '0.06em',
                                        lineHeight: 1,
                                        color: '#ffffff',
                                        textShadow: '0 0 40px rgba(168,85,247,0.9), 0 0 80px rgba(168,85,247,0.4), 0 0 120px rgba(99,102,241,0.25)',
                                        userSelect: 'none',
                                    }}
                                >
                                    SUVARX
                                </span>
                                {/* Tagline */}
                                <span
                                    className="suvarx-tagline"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '0.68rem',
                                        letterSpacing: '0.4em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(167,139,250,0.6)',
                                    }}
                                >
                                    Premium Auto &amp; Lifestyle
                                </span>
                            </div>
                        )}

                        {/* Scanning beam line */}
                        <div className="suvarx-scan-beam" />

                        {/* Progress bar */}
                        <div className="relative w-48 sm:w-64">
                            <div
                                className="h-[2px] rounded-full"
                                style={{
                                    background: 'rgba(139,92,246,0.15)',
                                }}
                            />
                            <div
                                className="absolute top-0 left-0 h-[2px] rounded-full suvarx-progress-glow transition-all duration-150"
                                style={{
                                    width: `${loadProgress}%`,
                                    background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                                }}
                            />
                        </div>

                        {/* Status label */}
                        <div className="flex items-center gap-2">
                            <span
                                className="suvarx-dot-pulse"
                                style={{ background: '#a855f7' }}
                            />
                            <span
                                style={{
                                    fontFamily: "'Space Grotesk', monospace",
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.28em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(161,161,170,0.6)',
                                }}
                            >
                                Initializing • {loadProgress}%
                            </span>
                        </div>
                    </div>

                    {/* Corner decoration lines */}
                    <div className="suvarx-corner suvarx-corner-tl" />
                    <div className="suvarx-corner suvarx-corner-tr" />
                    <div className="suvarx-corner suvarx-corner-bl" />
                    <div className="suvarx-corner suvarx-corner-br" />
                </div>
            )}

            {/* ========================================================================= */}
            {/* HERO BANNER SECTION (NEW - Admin Controlled)                              */}
            {/* ========================================================================= */}
            {heroBanners && heroBanners.length > 0 && (
                <HeroBanner banners={heroBanners} />
            )}

            {/* ========================================================================= */}
            {/* STEP 2: HOME SCENE (CYBERPUNK FUTURISTIC SHOWCASE AS IN IMAGE 2)          */}
            {/* ========================================================================= */}
            <section className="relative min-h-screen flex flex-col justify-between items-center px-3 sm:px-6 pt-24 pb-8 overflow-hidden select-none">
                {/* Dynamic Product Showcase Background (Image / Gradient / Color) */}
                <div 
                    className="absolute inset-0 w-full h-full z-0 transition-all duration-700 pointer-events-none"
                    style={getShowcaseBackground(settings, activeDrop)}
                />
                
                {/* Ambient Contrast Overlays */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070709]/50 to-[#070709] z-0 pointer-events-none" />

                {/* Top Pedestal Pill: SELECT DROP • 01 / 03 */}
                <div className="relative w-64 sm:w-80 h-10 rounded-full bg-[#12131c]/80 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-xl z-20 mb-4 sm:mb-6">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-300">
                        SELECT DROP • {String(activeIndex + 1).padStart(2, '0')} / {String(drops.length || 3).padStart(2, '0')}
                    </span>
                </div>

                {/* MAIN FUTURISTIC GLASSMORPHIC SHOWCASE CARD */}
                <div className="relative w-[95%] max-w-7xl min-h-[580px] lg:min-h-[640px] rounded-[2.5rem] bg-[#0c0d12]/80 hover:bg-[#0c0d12]/85 border border-white/15 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 overflow-visible transition-all duration-500">
                    
                    {/* Left Navigation Arrow (<) Floating on Card Edge */}
                    <button
                        onClick={prevDrop}
                        aria-label="Previous Drop"
                        className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#12131c]/90 hover:bg-[#1f202e] border border-white/20 hover:border-pink-500/80 backdrop-blur-xl flex items-center justify-center text-white/80 hover:text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] active:scale-95 group cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Right Navigation Arrow (>) Floating on Card Edge */}
                    <button
                        onClick={nextDrop}
                        aria-label="Next Drop"
                        className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#12131c]/90 hover:bg-[#1f202e] border border-white/20 hover:border-pink-500/80 backdrop-blur-xl flex items-center justify-center text-white/80 hover:text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] active:scale-95 group cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Top Content Row: Left Info + Center Garment + Right Thumbnails */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
                        
                        {/* ============================================================= */}
                        {/* LEFT COLUMN: TITLE, SUBTITLE, DESCRIPTION, CTAS & BADGES      */}
                        {/* ============================================================= */}
                        <div className="lg:col-span-5 space-y-6 text-left z-20">
                            
                            {/* New Drop Pill */}
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-mono font-extrabold uppercase tracking-[0.25em] text-pink-400">
                                    NEW DROP
                                </span>
                                <div className="w-12 h-[1px] bg-pink-500/40" />
                            </div>

                            {/* Main Product Title */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeDrop.id + '-title'}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-2.5"
                                >
                                    <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold uppercase tracking-tight leading-[1.12] text-white font-sans drop-shadow-sm">
                                        {activeDrop.fullTitle || `${activeDrop.titleLine1} ${activeDrop.titleLine2}`}
                                    </h2>
                                    <div className="flex items-center gap-2 pt-0.5">
                                        <span className="text-xs sm:text-sm font-mono tracking-[0.25em] font-semibold text-pink-400 uppercase">
                                            {activeDrop.titleSub || 'LIMITED EDITION DROP'}
                                        </span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-white/60 font-normal leading-relaxed max-w-md line-clamp-3">
                                {activeDrop.description || 'Forged in shadows. Inspired by legends. Wear the warrior within.'}
                            </p>

                            {/* Action Buttons: SHOP NOW & EXPLORE DROP */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black tracking-wider px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase text-xs cursor-pointer"
                                >
                                    <span>SHOP NOW</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                
                                <button
                                    onClick={() => scrollToScene('detail-scene')}
                                    className="bg-white/5 hover:bg-white/15 border border-white/10 text-white font-extrabold tracking-wider px-6 py-3.5 rounded-full backdrop-blur-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase text-xs cursor-pointer"
                                >
                                    <span>EXPLORE DROP</span>
                                    <RotateCcw className="w-3.5 h-3.5 text-white/60" />
                                </button>
                            </div>

                            {/* 3 Feature Badges: Premium Quality, Limited Edition, Secure Payment */}
                            <div className="flex items-center gap-6 sm:gap-8 pt-4 border-t border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400">
                                        <Box className="w-4 h-4" />
                                    </div>
                                    <div className="text-left font-mono">
                                        <div className="text-[10px] font-extrabold text-white uppercase tracking-wider leading-none">PREMIUM</div>
                                        <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">QUALITY</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div className="text-left font-mono">
                                        <div className="text-[10px] font-extrabold text-white uppercase tracking-wider leading-none">LIMITED</div>
                                        <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">EDITION</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="text-left font-mono">
                                        <div className="text-[10px] font-extrabold text-white uppercase tracking-wider leading-none">SECURE</div>
                                        <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">PAYMENT</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================= */}
                        {/* CENTER COLUMN: GLOWING NEON PORTAL RING + CENTERPIECE GARMENT */}
                        {/* ============================================================= */}
                        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] lg:min-h-[460px]">
                            {/* Ambient Glow Aura */}
                            <div className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[90px] opacity-40 pointer-events-none transition-colors duration-1000 bg-gradient-to-tr ${activeDrop.colorMood || 'from-pink-500 to-purple-500'}`} />
                            
                            {/* Circular Neon Rim */}
                            <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[410px] lg:h-[410px] rounded-full border-[2.5px] border-transparent bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2.5px] shadow-[0_0_50px_rgba(236,72,153,0.45),0_0_80px_rgba(59,130,246,0.3)] pointer-events-none">
                                <div className="w-full h-full rounded-full bg-[#0a0b10]/95" />
                            </div>

                            {/* Floating Main Garment with Dynamic Floating Physics */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeDrop.id}
                                    initial={{ opacity: 0, scale: 0.88, rotate: -12 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        rotate: -6,
                                        y: [0, -10, 0]
                                    }}
                                    exit={{ opacity: 0, scale: 0.88, rotate: 6 }}
                                    transition={{
                                        opacity: { duration: 0.35 },
                                        scale: { duration: 0.45, ease: "easeOut" },
                                        rotate: { duration: 0.45, ease: "easeOut" },
                                        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="relative z-10 cursor-pointer group flex items-center justify-center"
                                    onClick={() => navigate(`/product/${activeDrop.slug}`)}
                                >
                                    <img
                                        src={activeDrop.image}
                                        alt={activeDrop.fullTitle}
                                        className="max-h-[320px] sm:max-h-[390px] lg:max-h-[440px] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] select-none group-hover:scale-105 transition-transform duration-500"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* ============================================================= */}
                        {/* RIGHT COLUMN: VERTICAL PRODUCT THUMBNAIL SELECTOR             */}
                        {/* ============================================================= */}
                        <div className="lg:col-span-2 hidden lg:flex flex-col gap-3 justify-center items-end z-20">
                            {drops.map((drop, idx) => {
                                const isActive = idx === activeIndex;
                                return (
                                    <button
                                        key={drop.id}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`relative w-20 h-20 xl:w-24 xl:h-24 rounded-2xl p-2 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer ${
                                            isActive
                                                ? 'bg-[#181924] border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] scale-105 z-10'
                                                : 'bg-[#101118]/80 border border-white/10 hover:border-white/30 opacity-60 hover:opacity-100 hover:scale-100'
                                        }`}
                                        title={drop.fullTitle}
                                    >
                                        {isActive && (
                                            <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-500 rounded-r-full" />
                                        )}
                                        <img
                                            src={drop.image}
                                            alt={drop.fullTitle}
                                            className="w-full h-full object-contain drop-shadow-md"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ============================================================= */}
                    {/* CARD FOOTER BAR: FOLLOW US + SEGMENTED PROGRESS + COUNTER     */}
                    {/* ============================================================= */}
                    <div className="w-full pt-4 mt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono z-20">
                        {/* Left: Follow Us */}
                        <div className="flex items-center gap-3 text-white/50">
                            <span className="text-[10px] tracking-widest uppercase font-bold text-white/40">FOLLOW US</span>
                            <div className="flex items-center gap-2.5">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors" title="Facebook">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors" title="Instagram">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                <a href="https://x.com" target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors" title="X">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Center: Segmented Progress Pills */}
                        <div className="flex items-center gap-2">
                            {drops.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === activeIndex
                                            ? 'w-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]'
                                            : 'w-8 bg-white/15 hover:bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Right: Counter 01 —— 03 */}
                        <div className="flex items-center gap-2 font-mono">
                            <span className="font-extrabold text-white text-base">
                                {String(activeIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="w-6 h-[1px] bg-white/30"></span>
                            <span className="text-white/40">
                                {String(drops.length || 3).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Stacked Arrows on Bottom Corners */}
                <div className="absolute bottom-6 left-8 hidden sm:flex flex-col gap-1 text-zinc-600 font-mono text-xs select-none pointer-events-none">
                    <span>▼</span>
                    <span>▼</span>
                </div>
                <div className="absolute bottom-6 right-8 hidden sm:flex flex-col gap-1 text-zinc-600 font-mono text-xs select-none pointer-events-none">
                    <span>▼</span>
                    <span>▼</span>
                </div>

                {/* "Scroll to discover" pulsating hint */}
                <button
                    type="button"
                    onClick={() => scrollToScene('detail-scene')}
                    className="text-[10px] font-mono tracking-widest text-zinc-500 hover:text-white uppercase flex items-center gap-1.5 pt-4 animate-bounce-subtle cursor-pointer pointer-events-auto z-10"
                >
                    <span>SCROLL TO DISCOVER</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                </button>
            </section>

            {/* ========================================================================= */}
            {/* STEP 3: PRODUCT DETAIL SCENE (ZOOMED + ICON INFO RAIL)                     */}
            {/* ========================================================================= */}
            <section
                id="detail-scene"
                className="min-h-screen relative flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-hidden transition-all duration-700 select-none"
                style={getProductDropBackground(activeDrop, isDark)}
            >
                {/* Fallback gradient background if no product-specific background is configured */}
                {(!activeDrop.bg_image && !activeDrop.bg_gradient && !activeDrop.bg_color) && (
                    <div 
                        className={`absolute inset-0 z-0 bg-gradient-to-br transition-colors duration-1000 pointer-events-none ${
                            isDark ? activeDrop.colorMood : activeDrop.lightMood
                        }`} 
                    />
                )}

                {/* Ambient dark contrast overlay for readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-0 pointer-events-none" />

                {/* Faint Background Watermark Letters */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                    <span className="ciao-title text-[15vw] text-white/5 whitespace-nowrap tracking-tighter">
                        {activeDrop.watermark}
                    </span>
                </div>

                {/* Left Navigation Arrow (<) */}
                <button
                    onClick={prevDrop}
                    className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border backdrop-blur-md transition-all active:scale-95 ${
                        isDark ? 'bg-white/5 hover:bg-white/15 text-white/80 border-white/10' : 'bg-black/5 hover:bg-black/10 text-black border-black/10'
                    }`}
                    title="Previous Drop"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Navigation Arrow (>) */}
                <button
                    onClick={nextDrop}
                    className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border backdrop-blur-md transition-all active:scale-95 ${
                        isDark ? 'bg-white/5 hover:bg-white/15 text-white/80 border-white/10' : 'bg-black/5 hover:bg-black/10 text-black border-black/10'
                    }`}
                    title="Next Drop"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10 px-12 sm:px-0">
                    {/* Left: Big Two-Line Product Name + Short Description */}
                    <div className="lg:col-span-6 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400">
                                        0{activeIndex + 1} / 0{drops.length} • CLOSE-UP DETAIL
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight font-sans">
                                        {activeDrop.fullTitle || `${activeDrop.name} ${activeDrop.subtitle}`}
                                    </h2>
                                </div>

                                <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed font-medium">
                                    {activeDrop.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="pt-2 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-glow-white active:scale-95 transition-all flex items-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Buy Now ({formatPrice(activeDrop.price)})</span>
                            </button>
                        </div>
                    </div>

                    {/* Center: Large Floating Product Image & Right: Icon Info Rail */}
                    <div className="lg:col-span-6 relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-white/20 transform -rotate-2 hover:rotate-0 transition-transform duration-700 group"
                            >
                                <img
                                    src={activeDrop.image}
                                    alt={activeDrop.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Right: Vertical Stack of Circular Icon Buttons (Icon Info Rail) */}
                        <div className="absolute -right-2 sm:-right-6 flex flex-col gap-3 z-20">
                            {/* Fabric Icon */}
                            <div className="relative group/tip">
                                <button
                                    type="button"
                                    onClick={() => setActiveTooltip(activeTooltip === 'fabric' ? null : 'fabric')}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
                                        activeTooltip === 'fabric' ? 'bg-pink-500 text-white border-pink-400 scale-110' : 'bg-black/60 text-zinc-300 border-white/20 hover:text-white'
                                    }`}
                                    title="Fabric Details"
                                >
                                    <Feather className="w-5 h-5" />
                                </button>
                                {(activeTooltip === 'fabric' || false) && (
                                    <div className="absolute right-14 top-1/2 -translate-y-1/2 w-56 p-3 bg-black/90 text-white text-xs rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl z-30 animate-slide-left">
                                        <strong className="block text-pink-400 font-mono uppercase text-[10px]">Fabric Info:</strong>
                                        {activeDrop.specSheet.fabric}
                                    </div>
                                )}
                            </div>

                            {/* Fit Icon */}
                            <div className="relative group/tip">
                                <button
                                    type="button"
                                    onClick={() => setActiveTooltip(activeTooltip === 'fit' ? null : 'fit')}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
                                        activeTooltip === 'fit' ? 'bg-purple-500 text-white border-purple-400 scale-110' : 'bg-black/60 text-zinc-300 border-white/20 hover:text-white'
                                    }`}
                                    title="Fit & Cut"
                                >
                                    <Scissors className="w-5 h-5" />
                                </button>
                                {(activeTooltip === 'fit' || false) && (
                                    <div className="absolute right-14 top-1/2 -translate-y-1/2 w-56 p-3 bg-black/90 text-white text-xs rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl z-30 animate-slide-left">
                                        <strong className="block text-purple-400 font-mono uppercase text-[10px]">Fit & Silhouette:</strong>
                                        {activeDrop.specSheet.fit}
                                    </div>
                                )}
                            </div>

                            {/* Print Icon */}
                            <div className="relative group/tip">
                                <button
                                    type="button"
                                    onClick={() => setActiveTooltip(activeTooltip === 'print' ? null : 'print')}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
                                        activeTooltip === 'print' ? 'bg-blue-500 text-white border-blue-400 scale-110' : 'bg-black/60 text-zinc-300 border-white/20 hover:text-white'
                                    }`}
                                    title="Print Quality"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </button>
                                {(activeTooltip === 'print' || false) && (
                                    <div className="absolute right-14 top-1/2 -translate-y-1/2 w-56 p-3 bg-black/90 text-white text-xs rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl z-30 animate-slide-left">
                                        <strong className="block text-blue-400 font-mono uppercase text-[10px]">Print Technique:</strong>
                                        {activeDrop.specSheet.print}
                                    </div>
                                )}
                            </div>

                            {/* Care Icon */}
                            <div className="relative group/tip">
                                <button
                                    type="button"
                                    onClick={() => setActiveTooltip(activeTooltip === 'care' ? null : 'care')}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
                                        activeTooltip === 'care' ? 'bg-emerald-500 text-white border-emerald-400 scale-110' : 'bg-black/60 text-zinc-300 border-white/20 hover:text-white'
                                    }`}
                                    title="Wash & Care"
                                >
                                    <Droplets className="w-5 h-5" />
                                </button>
                                {(activeTooltip === 'care' || false) && (
                                    <div className="absolute right-14 top-1/2 -translate-y-1/2 w-56 p-3 bg-black/90 text-white text-xs rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl z-30 animate-slide-left">
                                        <strong className="block text-emerald-400 font-mono uppercase text-[10px]">Care Instructions:</strong>
                                        {activeDrop.specSheet.care}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* STEP 4: BRAND STATEMENT SCENE (CIAO ZERO BULLSHIT STYLE)                   */}
            {/* ========================================================================= */}
            <section className="min-h-screen relative flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-hidden bg-gradient-to-b from-[#6B0B2A] via-[#3a0617] to-[#070709] text-center">
                {/* Giant Full-Screen Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                    <span className="ciao-title text-[16vw] font-extrabold text-white/10 tracking-tighter leading-none whitespace-nowrap">
                        DRIVE IN STYLE
                    </span>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-float-gentle">
                    <div className="relative w-60 sm:w-72 mx-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border-2 border-white/30">
                        <img
                            src={activeDrop.image}
                            alt="Brand Statement"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 inset-x-3 p-2 bg-black/70 backdrop-blur-md rounded-xl text-[10px] font-mono font-bold text-white uppercase">
                            PREMIUM • ZERO COMPROMISE
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="ciao-title text-4xl sm:text-6xl text-white tracking-tight">
                            ZERO COMPROMISE. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300">
                                ONLY PREMIUM QUALITY.
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-medium">
                            Every product is precision-engineered for your vehicle, built for durability and effortless installation.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => scrollToScene('buy-section')}
                            className="px-8 py-4 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-glow-white transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>Ready to Buy</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* STEP 5: SHOP / BUY SECTION                                                */}
            {/* ========================================================================= */}
            <section id="buy-section" className={`py-24 px-4 sm:px-8 border-t transition-colors duration-300 ${
                isDark ? 'bg-[#0A0A0C] border-white/10 text-white' : 'bg-white border-black/10 text-black'
            }`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left: Product Image */}
                    <div className="lg:col-span-6 flex justify-center">
                        <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                            <img
                                src={activeDrop.image}
                                alt={activeDrop.fullTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Purchase Controls */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-500">
                                OFFICIAL DROP
                            </span>
                            <h2 className="ciao-title text-3xl sm:text-4xl tracking-tight">
                                {activeDrop.fullTitle}
                            </h2>
                            <div className="flex items-baseline gap-3 pt-1">
                                <span className="ciao-title text-3xl">
                                    {formatPrice(activeDrop.price)}
                                </span>
                                <span className="text-xs font-mono font-bold uppercase text-emerald-500">
                                    • IN STOCK (READY TO DISPATCH)
                                </span>
                            </div>
                        </div>


                        {/* Quantity & CTA Buttons */}
                        <div className="space-y-3 pt-2">
                            <div className="flex gap-3">
                                <div className={`flex items-center border rounded-2xl p-1 ${
                                    isDark ? 'border-white/15 bg-black/40' : 'border-black/10 bg-zinc-100'
                                }`}>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-zinc-400"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-mono font-bold text-xs">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-zinc-400"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-4 font-extrabold text-xs rounded-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                        isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-glow-white' : 'bg-black text-white hover:bg-zinc-800'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs rounded-2xl uppercase tracking-wider transition-all shadow-md active:scale-95"
                            >
                                Instant 1-Click Checkout
                            </button>

                            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                                <span>• 30-Day Free Return Policy</span>
                                <span>• Free Worldwide Express Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};
