import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export const Footer = () => {
    const { settings } = useSettings();

    // Check if footer is globally disabled
    if (settings?.footer_enabled === 'false' || settings?.footer_enabled === false) {
        return null;
    }

    const showLogo = settings?.footer_show_logo !== 'false' && settings?.footer_show_logo !== false;
    const footerLogo = settings?.footer_logo || null;
    const footerName = settings?.footer_name || 'SUVARX';
    const footerDesc = settings?.footer_description || 'Engineered for premium auto & lifestyle enthusiasts. Smart gadgets, premium fragrances, and cutting-edge car electronics.';
    
    const col1Title = settings?.footer_col_1_title || 'Drops';
    const col2Title = settings?.footer_col_2_title || 'Customer Care';
    const col3Title = settings?.footer_col_3_title || 'Direct Support';
    
    const col3Text = settings?.footer_col_3_text || 'Email: orders@suvarx.com\nStudio: Dhaka, Bangladesh\nMon — Sat: 9:00 AM — 7:00 PM';
    const copyright = settings?.footer_copyright || `© ${new Date().getFullYear()} SUVARX. ALL RIGHTS RESERVED.`;

    let col1Links = [
        { label: 'Dashcams & DVRs', url: '/shop?category=dashcams' },
        { label: 'Phone Mounts', url: '/shop?category=phone-mounts' },
        { label: 'Car Vacuums', url: '/shop?category=car-vacuums' },
        { label: 'Seat Accessories', url: '/shop?category=seat-accessories' }
    ];
    let col2Links = [
        { label: 'Track Order', url: '/track-order' },
        { label: 'All Products', url: '/shop' },
        { label: 'Shopping Bag', url: '/cart' },
        { label: 'Admin CMS', url: '/admin' }
    ];

    try {
        if (settings?.footer_col_1_links) col1Links = typeof settings.footer_col_1_links === 'string' ? JSON.parse(settings.footer_col_1_links) : settings.footer_col_1_links;
        if (settings?.footer_col_2_links) col2Links = typeof settings.footer_col_2_links === 'string' ? JSON.parse(settings.footer_col_2_links) : settings.footer_col_2_links;
    } catch (e) {
        console.error('Failed to parse footer links', e);
    }

    return (
        <footer className="bg-[#050507] text-white border-t border-white/10 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Value Propositions Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-pink-400">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-extrabold uppercase text-white font-mono">Fast Worldwide Delivery</h4>
                            <p className="text-zinc-500 text-[11px]">Free shipping over $75</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-purple-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-extrabold uppercase text-white font-mono">Premium Car Accessories</h4>
                            <p className="text-zinc-500 text-[11px]">Quality guaranteed for every product</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-extrabold uppercase text-white font-mono">30-Day Free Returns</h4>
                            <p className="text-zinc-500 text-[11px]">Easy installation guide</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-extrabold uppercase text-white font-mono">Encrypted Checkout</h4>
                            <p className="text-zinc-500 text-[11px]">COD, Cards, bKash & Nagad</p>
                        </div>
                    </div>
                </div>

                {/* 4-Column Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10 text-xs font-mono">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        {showLogo && footerLogo ? (
                            <img src={footerLogo} alt={footerName} className="h-10 w-auto object-contain" />
                        ) : (
                            <span
                                className="ciao-title text-2xl"
                                style={{
                                    color: '#ffffff',
                                    textShadow: '0 0 30px rgba(168,85,247,0.9), 0 0 60px rgba(99,102,241,0.4)',
                                    letterSpacing: '0.06em',
                                }}
                            >
                                {footerName}
                            </span>
                        )}
                        <p className="text-zinc-500 leading-relaxed text-[11px] font-sans whitespace-pre-wrap">
                            {footerDesc}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
                            {col1Title}
                        </h4>
                        <ul className="space-y-2 text-zinc-400 text-[11px]">
                            {col1Links.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
                            {col2Title}
                        </h4>
                        <ul className="space-y-2 text-zinc-400 text-[11px]">
                            {col2Links.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
                            {col3Title}
                        </h4>
                        {col3Text.split('\n').map((line, idx) => (
                            <p key={idx} className="text-zinc-400 text-[11px]">{line}</p>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
                    <div>
                        {copyright}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">VISA</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">MASTERCARD</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">BKASH</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">NAGAD</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
