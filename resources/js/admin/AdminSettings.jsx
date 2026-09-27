import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { Save, Store, Truck, Percent, Sparkles, Mail, Phone, MapPin, Share2, X, Plus, Trash2, LayoutTemplate } from 'lucide-react';

export const AdminSettings = () => {
    const { settings, fetchSettings } = useSettings();
    const { showToast } = useCart();

    const [formData, setFormData] = useState({
        store_name: '',
        store_tagline: '',
        store_email: '',
        store_phone: '',
        store_address: '',
        currency_symbol: '৳',
        currency_code: 'BDT',
        shipping_standard_fee: '60.00',
        shipping_express_fee: '120.00',
        free_shipping_min: '1500.00',
        tax_rate_percent: '0.00',
        announcement_bar: '',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        loading_logo_file: null,
        header_logo_file: null,
        delete_loading_logo: false,
        delete_header_logo: false,
        loading_logo: null,
        header_logo: null,
        footer_enabled: true,
        footer_show_logo: true,
        footer_logo_file: null,
        delete_footer_logo: false,
        footer_logo: null,
        footer_name: 'M3S APPAREL',
        footer_description: 'Engineered for heavyweight streetwear purists. 240 GSM organic combed cotton crafted with high-density screen prints.',
        footer_col_1_title: 'Drops',
        footer_col_1_links: [
            { label: 'Streetwear Drops', url: '/shop?category=streetwear-drops' },
            { label: '240 GSM Basics', url: '/shop?category=heavyweight-basics' },
            { label: 'Oversized Fit', url: '/shop?category=oversized-boxy-fit' },
            { label: 'Vintage Acid Wash', url: '/shop?category=vintage-acid-wash' }
        ],
        footer_col_2_title: 'Customer Care',
        footer_col_2_links: [
            { label: 'Track Order', url: '/track-order' },
            { label: 'Size Guide', url: '/shop' },
            { label: 'Shopping Bag', url: '/cart' },
            { label: 'Admin CMS', url: '/admin' }
        ],
        footer_col_3_title: 'Direct Support',
        footer_col_3_text: 'Email: orders@m3sapparel.com\nStudio: SoHo Arts District, NY\nMon — Sat: 9:00 AM — 7:00 PM',
        footer_copyright: '© 2026 M3S APPAREL. ALL RIGHTS RESERVED.',
        showcase_bg_type: 'image',
        showcase_bg_color: '#000000',
        showcase_bg_gradient: 'from-pink-500 via-purple-500 to-cyan-500',
        showcase_bg_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        showcase_bg_image_file: null
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData(prev => ({
                ...prev,
                ...settings,
                showcase_bg_type: settings.showcase_bg_type || prev.showcase_bg_type || 'image',
                showcase_bg_color: settings.showcase_bg_color || prev.showcase_bg_color || '#070709',
                showcase_bg_gradient: settings.showcase_bg_gradient || prev.showcase_bg_gradient || 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)',
                showcase_bg_image_url: settings.showcase_bg_image_url !== undefined ? settings.showcase_bg_image_url : prev.showcase_bg_image_url,
                delete_showcase_bg_image: false,
                footer_enabled: settings.footer_enabled !== 'false' && settings.footer_enabled !== false,
                footer_show_logo: settings.footer_show_logo !== 'false' && settings.footer_show_logo !== false,
                footer_col_1_links: settings.footer_col_1_links ? (typeof settings.footer_col_1_links === 'string' ? JSON.parse(settings.footer_col_1_links) : settings.footer_col_1_links) : prev.footer_col_1_links,
                footer_col_2_links: settings.footer_col_2_links ? (typeof settings.footer_col_2_links === 'string' ? JSON.parse(settings.footer_col_2_links) : settings.footer_col_2_links) : prev.footer_col_2_links,
            }));
        }
    }, [settings]);

    const handleAddLink = (col) => {
        setFormData(prev => ({
            ...prev,
            [col]: [...prev[col], { label: '', url: '' }]
        }));
    };
    const handleUpdateLink = (col, index, field, value) => {
        setFormData(prev => {
            const newLinks = [...prev[col]];
            newLinks[index][field] = value;
            return { ...prev, [col]: newLinks };
        });
    };
    const handleRemoveLink = (col, index) => {
        setFormData(prev => {
            const newLinks = [...prev[col]];
            newLinks.splice(index, 1);
            return { ...prev, [col]: newLinks };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'footer_col_1_links' || key === 'footer_col_2_links') {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });
            await axios.post('/api/admin/settings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('Store settings updated successfully!', 'success');
            await fetchSettings();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save settings', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Store & CMS Settings
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Customize store identity, delivery rates, taxes, announcement bar, and contacts
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. General Identity */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Store className="w-5 h-5 text-slate-800" />
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Store Identity & Branding
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.store_name}
                                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                placeholder="M3S Store"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Store Tagline</label>
                            <input
                                type="text"
                                value={formData.store_tagline}
                                onChange={(e) => setFormData({ ...formData, store_tagline: e.target.value })}
                                placeholder="Premium Technology & Modern Essentials"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-700 mb-1">Top Announcement Bar Text</label>
                            <input
                                type="text"
                                value={formData.announcement_bar}
                                onChange={(e) => setFormData({ ...formData, announcement_bar: e.target.value })}
                                placeholder="🎉 Special Launch: 10% OFF with code WELCOME10 | Free express shipping over $99"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                        
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div>
                                <label className="block font-bold text-slate-700 mb-2">Header Logo</label>
                                {formData.header_logo && !formData.delete_header_logo ? (
                                    <div className="relative inline-flex border border-slate-200 rounded-xl p-3 bg-slate-50 mb-2 shadow-sm">
                                        <img src={formData.header_logo} alt="Header Logo" className="h-10 object-contain" />
                                        <button type="button" onClick={() => setFormData({...formData, delete_header_logo: true})} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors"><X className="w-3 h-3"/></button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({...formData, header_logo_file: file, header_logo: URL.createObjectURL(file), delete_header_logo: false});
                                            }
                                        }} className="w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-2">Loading Screen Logo</label>
                                {formData.loading_logo && !formData.delete_loading_logo ? (
                                    <div className="relative inline-flex border border-slate-200 rounded-xl p-3 bg-slate-900 mb-2 shadow-sm">
                                        <img src={formData.loading_logo} alt="Loading Logo" className="h-10 object-contain" />
                                        <button type="button" onClick={() => setFormData({...formData, delete_loading_logo: true})} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors"><X className="w-3 h-3"/></button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({...formData, loading_logo_file: file, loading_logo: URL.createObjectURL(file), delete_loading_logo: false});
                                            }
                                        }} className="w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Contact Details */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Mail className="w-5 h-5 text-slate-800" />
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Customer Support & Contact Info
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Support Email Address</label>
                            <input
                                type="email"
                                value={formData.store_email}
                                onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                                placeholder="support@m3s-store.com"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Support Phone Number</label>
                            <input
                                type="text"
                                value={formData.store_phone}
                                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                                placeholder="+1 (800) 555-0199"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-700 mb-1">Store Physical Address</label>
                            <input
                                type="text"
                                value={formData.store_address}
                                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                                placeholder="452 Tech Plaza, Silicon Valley, CA 94025"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Pricing, Delivery & Taxes */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Truck className="w-5 h-5 text-slate-800" />
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Currency, Shipping Rates & Taxes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Currency Symbol</label>
                            <input
                                type="text"
                                value={formData.currency_symbol}
                                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                                placeholder="৳"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Currency Code</label>
                            <input
                                type="text"
                                value={formData.currency_code}
                                onChange={(e) => setFormData({ ...formData, currency_code: e.target.value.toUpperCase() })}
                                placeholder="BDT"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Standard Delivery Fee (৳)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.shipping_standard_fee}
                                onChange={(e) => setFormData({ ...formData, shipping_standard_fee: e.target.value })}
                                placeholder="60.00"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Express Courier Fee (৳)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.shipping_express_fee}
                                onChange={(e) => setFormData({ ...formData, shipping_express_fee: e.target.value })}
                                placeholder="120.00"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Free Shipping Min Spend (৳)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.free_shipping_min}
                                onChange={(e) => setFormData({ ...formData, free_shipping_min: e.target.value })}
                                placeholder="1500.00"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Tax Rate Percentage (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.tax_rate_percent}
                                onChange={(e) => setFormData({ ...formData, tax_rate_percent: e.target.value })}
                                placeholder="5.0"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* 3.5 Home Page Settings */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-slate-800" />
                            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                Product Showcase Background
                            </h2>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">Live Website Showcase</span>
                    </div>

                    <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, showcase_bg_type: 'image' })}
                                className={`p-3.5 rounded-2xl border text-center font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    formData.showcase_bg_type === 'image'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                <span className="text-xs uppercase tracking-wider">🖼️ Image</span>
                                <span className="text-[10px] opacity-75 font-normal">Custom upload or URL</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, showcase_bg_type: 'gradient' })}
                                className={`p-3.5 rounded-2xl border text-center font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    formData.showcase_bg_type === 'gradient'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                <span className="text-xs uppercase tracking-wider">🌈 Gradient</span>
                                <span className="text-[10px] opacity-75 font-normal">Vibrant CSS gradients</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, showcase_bg_type: 'color' })}
                                className={`p-3.5 rounded-2xl border text-center font-bold transition-all flex flex-col items-center gap-1.5 ${
                                    formData.showcase_bg_type === 'color'
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                <span className="text-xs uppercase tracking-wider">🎨 Solid Color</span>
                                <span className="text-[10px] opacity-75 font-normal">Hex / Color picker</span>
                            </button>
                        </div>

                        {/* Image Option */}
                        {formData.showcase_bg_type === 'image' && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">Upload Background Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({
                                                    ...formData,
                                                    showcase_bg_image_file: file,
                                                    delete_showcase_bg_image: false
                                                });
                                            }
                                        }}
                                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">Or Direct Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.showcase_bg_image_url || ''}
                                        onChange={(e) => setFormData({ ...formData, showcase_bg_image_url: e.target.value, delete_showcase_bg_image: false })}
                                        placeholder="https://images.unsplash.com/... or /settings/my-bg.jpg"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
                                    />
                                </div>

                                {(formData.showcase_bg_image_file || (formData.showcase_bg_image_url && !formData.delete_showcase_bg_image)) && (
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm max-w-sm">
                                        <div className="aspect-[16/9] w-full bg-slate-900">
                                            <img
                                                src={formData.showcase_bg_image_file ? URL.createObjectURL(formData.showcase_bg_image_file) : formData.showcase_bg_image_url}
                                                alt="Showcase BG Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                showcase_bg_image_file: null,
                                                showcase_bg_image_url: '',
                                                delete_showcase_bg_image: true
                                            })}
                                            className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                                            title="Remove image"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gradient Option */}
                        {formData.showcase_bg_type === 'gradient' && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">Preset Gradient Themes</label>
                                    <select
                                        value={formData.showcase_bg_gradient || ''}
                                        onChange={(e) => setFormData({ ...formData, showcase_bg_gradient: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
                                    >
                                        <option value="linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)">Cyberpunk Pop (Pink / Purple / Cyan)</option>
                                        <option value="linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)">Midnight Dark (Deep Slate / Navy / Black)</option>
                                        <option value="linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)">Emerald Cyber (Emerald / Neon Green / Forest)</option>
                                        <option value="linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)">Sunset Flare (Amber / Orange / Flame)</option>
                                        <option value="linear-gradient(135deg, #581c87 0%, #3b0764 50%, #090514 100%)">Deep Violet (Electric Purple / Obsidian)</option>
                                        <option value="linear-gradient(135deg, #6b0b2a 0%, #3b061d 50%, #070709 100%)">Vintage Crimson (Dark Crimson / Wine / Charcoal)</option>
                                        <option value="linear-gradient(135deg, #0369a1 0%, #1e3a8a 50%, #030712 100%)">Electric Cobalt (Royal Blue / Dark)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">Or Custom CSS Gradient</label>
                                    <input
                                        type="text"
                                        value={formData.showcase_bg_gradient || ''}
                                        onChange={(e) => setFormData({ ...formData, showcase_bg_gradient: e.target.value })}
                                        placeholder="linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-slate-900 text-xs"
                                    />
                                </div>

                                {/* Live Swatch Preview */}
                                <div className="space-y-1.5">
                                    <label className="block font-bold text-slate-500 text-[11px]">Gradient Preview</label>
                                    <div
                                        className="h-16 w-full rounded-2xl shadow-inner border border-slate-200 transition-all duration-300"
                                        style={{ background: formData.showcase_bg_gradient || 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Color Option */}
                        {formData.showcase_bg_type === 'color' && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={formData.showcase_bg_color || '#070709'}
                                        onChange={(e) => setFormData({ ...formData, showcase_bg_color: e.target.value })}
                                        className="w-14 h-12 p-1 bg-white border border-slate-300 rounded-xl cursor-pointer shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <label className="block font-bold text-slate-700 mb-1">Color Hex Code</label>
                                        <input
                                            type="text"
                                            value={formData.showcase_bg_color || '#070709'}
                                            onChange={(e) => setFormData({ ...formData, showcase_bg_color: e.target.value })}
                                            placeholder="#070709"
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 font-bold uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Footer Settings */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-slate-800" />
                            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                Dynamic Footer Settings
                            </h2>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs font-bold text-slate-700">Enable Footer</span>
                            <input type="checkbox" checked={formData.footer_enabled} onChange={(e) => setFormData({...formData, footer_enabled: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        </label>
                    </div>

                    {formData.footer_enabled && (
                        <div className="space-y-6 animate-fade-in text-xs">
                            {/* Branding */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">Footer Logo</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.footer_show_logo} onChange={(e) => setFormData({...formData, footer_show_logo: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                            <span className="font-bold text-slate-600">Show Logo</span>
                                        </label>
                                    </div>
                                    {formData.footer_logo && !formData.delete_footer_logo ? (
                                        <div className="relative inline-flex border border-slate-200 rounded-xl p-3 bg-slate-900 shadow-sm mt-2">
                                            <img src={formData.footer_logo} alt="Footer Logo" className="h-10 object-contain" />
                                            <button type="button" onClick={() => setFormData({...formData, delete_footer_logo: true})} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600"><X className="w-3 h-3"/></button>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2">
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFormData({...formData, footer_logo_file: file, footer_logo: URL.createObjectURL(file), delete_footer_logo: false});
                                                }
                                            }} className="w-full text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Footer Brand Name</label>
                                        <input type="text" value={formData.footer_name} onChange={(e) => setFormData({...formData, footer_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Brand Description</label>
                                        <textarea value={formData.footer_description} onChange={(e) => setFormData({...formData, footer_description: e.target.value})} rows="3" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Links Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                                {/* Col 1 */}
                                <div className="space-y-3">
                                    <label className="block font-bold text-slate-700 mb-1">Column 1 Title</label>
                                    <input type="text" value={formData.footer_col_1_title} onChange={(e) => setFormData({...formData, footer_col_1_title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                    
                                    <div className="space-y-2">
                                        <label className="block font-bold text-slate-700">Links</label>
                                        {formData.footer_col_1_links.map((link, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input type="text" placeholder="Label" value={link.label} onChange={(e) => handleUpdateLink('footer_col_1_links', idx, 'label', e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                                <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleUpdateLink('footer_col_1_links', idx, 'url', e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                                <button type="button" onClick={() => handleRemoveLink('footer_col_1_links', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddLink('footer_col_1_links')} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold mt-2"><Plus className="w-3 h-3"/> Add Link</button>
                                    </div>
                                </div>

                                {/* Col 2 */}
                                <div className="space-y-3">
                                    <label className="block font-bold text-slate-700 mb-1">Column 2 Title</label>
                                    <input type="text" value={formData.footer_col_2_title} onChange={(e) => setFormData({...formData, footer_col_2_title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                    
                                    <div className="space-y-2">
                                        <label className="block font-bold text-slate-700">Links</label>
                                        {formData.footer_col_2_links.map((link, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input type="text" placeholder="Label" value={link.label} onChange={(e) => handleUpdateLink('footer_col_2_links', idx, 'label', e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                                <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleUpdateLink('footer_col_2_links', idx, 'url', e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                                <button type="button" onClick={() => handleRemoveLink('footer_col_2_links', idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddLink('footer_col_2_links')} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold mt-2"><Plus className="w-3 h-3"/> Add Link</button>
                                    </div>
                                </div>
                            </div>

                            {/* Col 3 & Copyright */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                                <div className="space-y-3">
                                    <label className="block font-bold text-slate-700 mb-1">Support Column Title</label>
                                    <input type="text" value={formData.footer_col_3_title} onChange={(e) => setFormData({...formData, footer_col_3_title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                    <label className="block font-bold text-slate-700 mb-1">Support Info Text</label>
                                    <textarea value={formData.footer_col_3_text} onChange={(e) => setFormData({...formData, footer_col_3_text: e.target.value})} rows="4" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block font-bold text-slate-700 mb-1">Copyright Text</label>
                                    <input type="text" value={formData.footer_copyright} onChange={(e) => setFormData({...formData, footer_copyright: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {submitting ? 'Saving Settings...' : 'Save Store Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};
