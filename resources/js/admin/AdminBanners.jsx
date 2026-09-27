import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

export const AdminBanners = () => {
    const { showToast } = useCart();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        highlight_text: '',
        image_url: '',
        media_file: null,
        media_type: 'image',
        button_text: 'Shop Now',
        button_url: '/shop',
        type: 'hero_slider',
        is_active: true,
        sort_order: 1,
        bgType: 'color',
        bg_color: '#000000',
        bg_gradient: '',
        bg_image_url: '',
        bg_image_file: null,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/banners');
            setBanners(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleOpenCreate = () => {
        setEditingBanner(null);
        setFormData({
            title: '',
            subtitle: '',
            highlight_text: 'SPECIAL PROMO',
            image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
            media_file: null,
            media_type: 'image',
            button_text: 'Shop Now',
            button_url: '/shop',
            type: 'hero_slider',
            is_active: true,
            sort_order: banners.length + 1,
            bgType: 'color',
            bg_color: '#000000',
            bg_gradient: 'from-pink-500 via-purple-500 to-cyan-500',
            bg_image_url: '',
            bg_image_file: null,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (b) => {
        setEditingBanner(b);
        setFormData({
            title: b.title || '',
            subtitle: b.subtitle || '',
            highlight_text: b.highlight_text || '',
            image_url: b.image_url || '',
            media_file: null,
            media_type: b.media_type || 'image',
            button_text: b.button_text || 'Shop Now',
            button_url: b.button_url || '/shop',
            type: b.type || 'hero_slider',
            is_active: Boolean(b.is_active),
            sort_order: b.sort_order || 1,
            bgType: b.bg_image_url ? 'image' : (b.bg_gradient ? 'gradient' : 'color'),
            bg_color: b.bg_color || '#000000',
            bg_gradient: b.bg_gradient || 'from-pink-500 via-purple-500 to-cyan-500',
            bg_image_url: b.bg_image_url || '',
            bg_image_file: null,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (typeof formData[key] === 'boolean') {
                        payload.append(key, formData[key] ? 1 : 0);
                    } else {
                        payload.append(key, formData[key]);
                    }
                }
            });

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingBanner) {
                payload.append('_method', 'PUT');
                await axios.post(`/api/admin/banners/${editingBanner.id}`, payload, config);
                showToast('Banner updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/banners', payload, config);
                showToast('Banner created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save banner', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete banner "${title}"?`)) return;
        try {
            await axios.delete(`/api/admin/banners/${id}`);
            showToast('Banner deleted', 'info');
            fetchBanners();
        } catch (err) {
            showToast('Failed to delete banner', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Homepage Banners & Sliders
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage marketing hero carousel slides and promotional campaign banners
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Banner</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 text-center py-12 text-slate-400 text-xs">Loading banners...</div>
                ) : banners.map(b => (
                    <div key={b.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="aspect-[2/1] rounded-2xl bg-slate-900 overflow-hidden relative">
                                {b.image_url ? (
                                    b.media_type === 'video' ? (
                                        <video src={b.image_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {b.highlight_text && (
                                        <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg uppercase">
                                            {b.highlight_text}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{b.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {b.is_active ? 'Active' : 'Draft'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-semibold">Order: #{b.sort_order}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenEdit(b)}
                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(b.id, b.title)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-extrabold text-slate-900">
                                {editingBanner ? 'Edit Banner' : 'Create Banner'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Banner Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Next Generation Apple MacBook Pro M3"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Subtitle / Summary</label>
                                <textarea
                                    rows={2}
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="Supercharged for pros with liquid retina XDR..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Highlight Badge</label>
                                    <input
                                        type="text"
                                        value={formData.highlight_text}
                                        onChange={(e) => setFormData({ ...formData, highlight_text: e.target.value })}
                                        placeholder="NEW RELEASE 2026"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 1 })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Foreground Product Media *</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setFormData({ ...formData, media_file: e.target.files[0] })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                                />
                                {editingBanner?.image_url && !formData.media_file && (
                                    <div className="mt-2 text-[10px] text-emerald-600 font-medium">✓ Current foreground media active</div>
                                )}
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                                <label className="block font-bold text-slate-700 mb-2">Background Style</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                                        <input type="radio" checked={formData.bgType === 'color'} onChange={() => setFormData({ ...formData, bgType: 'color', bg_gradient: null, bg_image_file: null })} className="text-slate-900" /> Color
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                                        <input type="radio" checked={formData.bgType === 'gradient'} onChange={() => setFormData({ ...formData, bgType: 'gradient', bg_color: null, bg_image_file: null })} className="text-slate-900" /> Gradient
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                                        <input type="radio" checked={formData.bgType === 'image'} onChange={() => setFormData({ ...formData, bgType: 'image', bg_color: null, bg_gradient: null })} className="text-slate-900" /> Custom Image
                                    </label>
                                </div>

                                {formData.bgType === 'color' && (
                                    <div className="pt-2">
                                        <input type="color" value={formData.bg_color || '#000000'} onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })} className="w-12 h-10 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                                    </div>
                                )}

                                {formData.bgType === 'gradient' && (
                                    <div className="pt-2">
                                        <select value={formData.bg_gradient || ''} onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900">
                                            <option value="from-pink-500 via-purple-500 to-cyan-500">Cyberpunk Pop (Pink/Purple/Cyan)</option>
                                            <option value="from-slate-900 via-slate-800 to-black">Midnight (Dark Grays/Black)</option>
                                            <option value="from-emerald-500 to-emerald-900">Emerald Glass (Greens)</option>
                                            <option value="from-amber-400 to-orange-600">Sunset Flare (Amber/Orange)</option>
                                            <option value="from-[#3b061d] via-[#1a020d] to-[#070709]">Vintage Crimson Dark</option>
                                        </select>
                                        <div className={`mt-3 h-10 rounded-lg bg-gradient-to-tr ${formData.bg_gradient}`} />
                                    </div>
                                )}

                                {formData.bgType === 'image' && (
                                    <div className="pt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, bg_image_file: e.target.files[0] })}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white"
                                        />
                                        {(formData.bg_image_file || editingBanner?.bg_image_url) && (
                                            <div className="mt-3 aspect-video w-32 rounded-lg bg-slate-200 overflow-hidden border border-slate-300">
                                                <img src={formData.bg_image_file ? URL.createObjectURL(formData.bg_image_file) : editingBanner.bg_image_url} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                        placeholder="Explore Collection"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Button Link URL</label>
                                    <input
                                        type="text"
                                        value={formData.button_url}
                                        onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                                        placeholder="/shop"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded text-slate-900"
                                    />
                                    <span>Active Status</span>
                                </label>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-sm"
                                >
                                    {submitting ? 'Saving...' : 'Save Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
