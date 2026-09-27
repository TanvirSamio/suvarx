import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const HeroBanner = ({ banners = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!banners.length) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (!banners || banners.length === 0) return null;

    const activeBanner = banners[activeIndex];

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);

    // Determine background style
    const getBackgroundStyle = (banner) => {
        if (banner.bg_image_url) {
            return {
                backgroundImage: `url(${banner.bg_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        }
        if (banner.bg_gradient) {
            return {}; // handled via class name
        }
        if (banner.bg_color) {
            return { backgroundColor: banner.bg_color };
        }
        return { backgroundColor: '#070709' };
    };

    const bgClass = activeBanner.bg_gradient && !activeBanner.bg_image_url 
        ? `bg-gradient-to-tr ${activeBanner.bg_gradient}` 
        : '';

    return (
        <section className="relative w-full h-[85vh] sm:h-[90vh] lg:h-[95vh] overflow-hidden select-none">
            {/* Background Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeBanner.id + '-bg'}
                    initial={{ opacity: 0.5, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 z-0 ${bgClass}`}
                    style={getBackgroundStyle(activeBanner)}
                >
                    {/* Vignette Overlay for readability */}
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-90" />
                </motion.div>
            </AnimatePresence>

            {/* Foreground Content */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 pt-24 pb-12">
                
                {/* Text Side */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeBanner.id + '-text'}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-4"
                        >
                            {activeBanner.highlight_text && (
                                <span className="inline-block px-3 py-1 bg-white text-black font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-sm shadow-glow-white">
                                    {activeBanner.highlight_text}
                                </span>
                            )}
                            
                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                                {activeBanner.title}
                            </h1>
                            
                            {activeBanner.subtitle && (
                                <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-md drop-shadow-md">
                                    {activeBanner.subtitle}
                                </p>
                            )}

                            {activeBanner.button_text && (
                                <div className="pt-4">
                                    <button
                                        onClick={() => navigate(activeBanner.button_url || '/shop')}
                                        className="px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all flex items-center gap-2"
                                    >
                                        <span>{activeBanner.button_text}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Foreground Image Side */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh] flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {activeBanner.image_url && (
                            <motion.div
                                key={activeBanner.id + '-img'}
                                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    x: 0,
                                    y: [0, -15, 0] // Floating animation
                                }}
                                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                transition={{
                                    opacity: { duration: 0.6 },
                                    scale: { duration: 0.6 },
                                    x: { duration: 0.6 },
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="w-full h-full flex justify-center items-center"
                            >
                                {activeBanner.media_type === 'video' ? (
                                    <video 
                                        src={activeBanner.image_url} 
                                        autoPlay loop muted playsInline 
                                        className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl" 
                                    />
                                ) : (
                                    <img 
                                        src={activeBanner.image_url} 
                                        alt={activeBanner.title} 
                                        className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((b, idx) => (
                            <button
                                key={b.id}
                                onClick={() => setActiveIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeIndex ? 'w-8 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'w-4 bg-white/30 hover:bg-white/60'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};
