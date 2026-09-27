import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    X, 
    Check, 
    Star, 
    Image, 
    Layers, 
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Palette,
    UploadCloud,
    Eye,
    RefreshCw
} from 'lucide-react';

const GRADIENT_PRESETS = [
    { label: 'Cyber Violet', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)' },
    { label: 'Midnight Nebula', value: 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)' },
    { label: 'Crimson Velvet', value: 'linear-gradient(135deg, #6b0b2a 0%, #3b061d 50%, #070709 100%)' },
    { label: 'Emerald Matrix', value: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' },
    { label: 'Sunset Ember', value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #7c2d12 100%)' },
    { label: 'Royal Cobalt', value: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 50%, #030712 100%)' },
    { label: 'Electric Purple', value: 'linear-gradient(135deg, #9333ea 0%, #4c1d95 50%, #0f172a 100%)' },
    { label: 'Stealth Noir', value: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)' },
];

const IMAGE_PRESETS = [
    { label: 'Dark Grid Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Cyberpunk Smoke', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Minimal Wave', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Neon Studio Grid', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop' },
];

export const AdminProducts = () => {
    const { formatPrice } = useSettings();
    const { showToast } = useCart();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [bgImagePreview, setBgImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        sku: '',
        price: '',
        compare_price: '',
        cost_price: '',
        stock_quantity: 10,
        category_id: '',
        brand_id: '',
        thumbnail: '',
        thumbnail_file: null,
        model_3d: null,
        bg_type: 'gradient',
        bg_image: '',
        bg_image_file: null,
        bg_gradient: 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)',
        bg_color: '#070709',
        delete_bg_image: false,
        theme_color_mood: '',
        theme_light_mood: '',
        theme_watermark: '',
        model_scale: 2.0,
        model_pos_x: 0,
        model_pos_y: 0,
        model_pos_z: 0,
        model_rot_x: 0,
        model_rot_y: 0,
        model_rot_z: 0,
        short_description: '',
        description: '',
        is_featured: false,
        is_trending: false,
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/api/admin/products?page=${page}`;
            if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
            if (selectedCategory) url += `&category_id=${selectedCategory}`;

            const res = await axios.get(url);
            setProducts(res.data.data || []);
            setPagination({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                total: res.data.total,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                axios.get('/api/admin/categories'),
                axios.get('/api/admin/brands'),
            ]);
            setCategories(catRes.data || []);
            setBrands(brandRes.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        fetchProducts(1);
    }, [search, selectedCategory]);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setActiveTab('basic');
        setThumbnailPreview(null);
        setBgImagePreview(null);
        setFormData({
            title: '',
            sku: '',
            price: '',
            compare_price: '',
            cost_price: '',
            stock_quantity: 10,
            category_id: categories[0]?.id || '',
            brand_id: brands[0]?.id || '',
            thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            thumbnail_file: null,
            model_3d: null,
            bg_type: 'gradient',
            bg_image: '',
            bg_image_file: null,
            bg_gradient: 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)',
            bg_color: '#070709',
            delete_bg_image: false,
            theme_color_mood: '',
            theme_light_mood: '',
            theme_watermark: '',
            model_scale: 2.0,
            model_pos_x: 0,
            model_pos_y: 0,
            model_pos_z: 0,
            model_rot_x: 0,
            model_rot_y: 0,
            model_rot_z: 0,
            fabric: '',
            gsm: '',
            fit: '',
            neck: '',
            sleeve: '',
            care_instructions: '',
            seo_title: '',
            seo_desc: '',
            text_color: '',
            short_description: '',
            description: '',
            is_featured: false,
            is_trending: false,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (p) => {
        setEditingProduct(p);
        setActiveTab('basic');
        setThumbnailPreview(p.thumbnail);
        setBgImagePreview(p.bg_image || null);
        setFormData({
            title: p.title || '',
            sku: p.sku || '',
            price: p.price || '',
            compare_price: p.compare_price || '',
            cost_price: p.cost_price || '',
            stock_quantity: p.stock_quantity ?? 0,
            category_id: p.category_id || '',
            brand_id: p.brand_id || '',
            thumbnail: p.thumbnail || '',
            thumbnail_file: null,
            model_3d: null,
            bg_type: p.bg_type || (p.bg_image ? 'image' : (p.bg_gradient ? 'gradient' : 'gradient')),
            bg_image: p.bg_image || '',
            bg_image_file: null,
            bg_gradient: p.bg_gradient || 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)',
            bg_color: p.bg_color || '#070709',
            delete_bg_image: false,
            theme_color_mood: p.theme_color_mood || '',
            theme_light_mood: p.theme_light_mood || '',
            theme_watermark: p.theme_watermark || '',
            model_scale: p.model_scale ?? 2.0,
            model_pos_x: p.model_pos_x ?? 0,
            model_pos_y: p.model_pos_y || 0,
            model_pos_z: p.model_pos_z || 0,
            model_rot_x: p.model_rot_x || 0,
            model_rot_y: p.model_rot_y || 0,
            model_rot_z: p.model_rot_z || 0,
            fabric: p.fabric || '',
            gsm: p.gsm || '',
            fit: p.fit || '',
            neck: p.neck || '',
            sleeve: p.sleeve || '',
            care_instructions: p.care_instructions || '',
            seo_title: p.seo_title || '',
            seo_desc: p.seo_desc || '',
            text_color: p.text_color || '',
            short_description: p.short_description || '',
            description: p.description || '',
            is_featured: Boolean(p.is_featured),
            is_trending: Boolean(p.is_trending),
            is_active: Boolean(p.is_active),
        });
        setIsModalOpen(true);
    };

    const handleBgFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                bg_image_file: file,
                bg_type: 'image',
                delete_bg_image: false
            }));
            setBgImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveBgImage = () => {
        setFormData(prev => ({
            ...prev,
            bg_image: '',
            bg_image_file: null,
            delete_bg_image: true
        }));
        setBgImagePreview(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    payload.append(key, formData[key]);
                }
            });

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingProduct) {
                payload.append('_method', 'PUT');
                await axios.post(`/api/admin/products/${editingProduct.id}`, payload, config);
                showToast('Product updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/products', payload, config);
                showToast('Product created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchProducts(pagination.current_page);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save product', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            await axios.delete(`/api/admin/products/${id}`);
            showToast('Product deleted', 'info');
            fetchProducts(pagination.current_page);
        } catch (err) {
            showToast('Failed to delete product', 'error');
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await axios.put(`/api/admin/products/${product.id}`, {
                ...product,
                is_active: !product.is_active,
            });
            showToast(`Product is now ${!product.is_active ? 'Active' : 'Draft'}`, 'success');
            fetchProducts(pagination.current_page);
        } catch (err) {
            showToast('Failed to update product status', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Product Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage catalog inventory, pricing, categories and stock levels
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search product title or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer w-full sm:w-48"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="py-3.5 px-4">Product</th>
                                <th className="py-3.5 px-4">Category / Brand</th>
                                <th className="py-3.5 px-4">Price</th>
                                <th className="py-3.5 px-4">Stock</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading products...</td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                                                    alt=""
                                                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-900 truncate max-w-xs">{product.title}</h4>
                                                    <span className="text-[11px] text-slate-400">SKU: {product.sku || 'N/A'}</span>
                                                    {product.is_featured && (
                                                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-slate-800">{product.category?.name || '—'}</div>
                                            <div className="text-[11px] text-slate-400">{product.brand?.name || '—'}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-extrabold text-slate-900">{formatPrice(product.price)}</div>
                                            {product.compare_price && (
                                                <div className="text-[11px] text-slate-400 line-through">{formatPrice(product.compare_price)}</div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                                                product.stock_quantity <= (product.low_stock_threshold || 5)
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                                {product.stock_quantity} in stock
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleToggleActive(product)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                                                    product.is_active
                                                        ? 'bg-slate-900 text-white hover:bg-slate-700'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                            >
                                                {product.is_active ? 'Active' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Edit product"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.title)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">No products found matching filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.last_page > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            Page {pagination.current_page} of {pagination.last_page} ({pagination.total} items)
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() => fetchProducts(pagination.current_page - 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => fetchProducts(pagination.current_page + 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-extrabold text-slate-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-6 border-b border-slate-100 flex gap-4 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'basic', label: 'Basic Info' },
                                { id: 'media', label: 'Media & 3D' },
                                { id: 'theme', label: 'Theme & Aesthetics' },
                                { id: 'specs', label: 'Editorial Specs' },
                                { id: 'seo', label: 'SEO' },
                                { id: 'advanced', label: 'Settings' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                            {/* BASIC INFO */}
                            {activeTab === 'basic' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Category</label>
                                            <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer">
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Brand</label>
                                            <select value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer">
                                                <option value="">Select Brand</option>
                                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block font-bold text-slate-700 mb-1">Sale Price ($) *</label>
                                            <input type="number" step="0.01" required min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                                            <textarea rows={2} value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block font-bold text-slate-700 mb-1">Full Description</label>
                                            <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MEDIA & 3D */}
                            {activeTab === 'media' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">Image Thumbnail Upload</label>
                                        <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, thumbnail_file: e.target.files[0] })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
                                        {thumbnailPreview && !formData.thumbnail_file && (
                                            <div className="mt-2 flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-lg max-w-max shadow-sm">
                                                <img src={thumbnailPreview} alt="current" className="h-10 w-10 object-cover rounded-md border border-slate-200" />
                                                <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">✓ Active Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">3D Model File (.glb, .gltf)</label>
                                        <input type="file" accept=".glb,.gltf" onChange={(e) => setFormData({ ...formData, model_3d: e.target.files[0] })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
                                        {editingProduct?.model_3d && !formData.model_3d && (
                                            <div className="mt-1 text-[10px] text-emerald-600 font-medium">✓ 3D model already uploaded. Uploading a new one will replace it.</div>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">🧊 3D Settings</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Scale</label>
                                                <input type="number" step="0.1" value={formData.model_scale} onChange={(e) => setFormData({ ...formData, model_scale: e.target.value })} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                                            </div>
                                            <div className="col-span-2 grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Pos X</label>
                                                    <input type="number" step="0.1" value={formData.model_pos_x} onChange={(e) => setFormData({...formData, model_pos_x: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Pos Y</label>
                                                    <input type="number" step="0.1" value={formData.model_pos_y} onChange={(e) => setFormData({...formData, model_pos_y: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Pos Z</label>
                                                    <input type="number" step="0.1" value={formData.model_pos_z} onChange={(e) => setFormData({...formData, model_pos_z: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Rot X</label>
                                                    <input type="number" step="0.1" value={formData.model_rot_x} onChange={(e) => setFormData({...formData, model_rot_x: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Rot Y</label>
                                                    <input type="number" step="0.1" value={formData.model_rot_y} onChange={(e) => setFormData({...formData, model_rot_y: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Rot Z</label>
                                                    <input type="number" step="0.1" value={formData.model_rot_z} onChange={(e) => setFormData({...formData, model_rot_z: e.target.value})} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* THEME & AESTHETICS */}
                            {activeTab === 'theme' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* BACKGROUND TYPE SELECTOR */}
                                    <div>
                                        <label className="block font-bold text-slate-800 mb-2 text-xs flex items-center justify-between">
                                            <span>Product Showcase Background Style</span>
                                            <span className="text-[11px] font-normal text-slate-400">Choose between a gradient or image backdrop</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'gradient', label: 'Gradient Mood', icon: Palette, desc: 'CSS Gradients & Glow' },
                                                { id: 'image', label: 'Background Image', icon: Image, desc: 'Uploaded or Web Image' },
                                                { id: 'color', label: 'Solid Color', icon: Sparkles, desc: 'Flat Minimal Tint' },
                                            ].map((type) => {
                                                const IconComp = type.icon;
                                                const isSelected = (formData.bg_type || 'gradient') === type.id;
                                                return (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, bg_type: type.id })}
                                                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                                            isSelected 
                                                                ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                                                                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <IconComp className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-slate-500'}`} />
                                                            {isSelected && <span className="w-2 h-2 rounded-full bg-pink-400"></span>}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-xs">{type.label}</div>
                                                            <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{type.desc}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* OPTION 1: GRADIENT SETTINGS */}
                                    {formData.bg_type === 'gradient' && (
                                        <div className="space-y-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                                    <Palette className="w-3.5 h-3.5 text-pink-500" />
                                                    <span>Gradient Presets</span>
                                                </h4>
                                                <span className="text-[10px] text-slate-400">Click any preset to apply</span>
                                            </div>

                                            {/* Preset Swatches Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {GRADIENT_PRESETS.map((preset, idx) => {
                                                    const isMatch = formData.bg_gradient === preset.value;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, bg_gradient: preset.value, bg_type: 'gradient' })}
                                                            className={`p-2 rounded-xl border flex items-center gap-2 transition-all text-left ${
                                                                isMatch
                                                                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm'
                                                                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <div 
                                                                className="w-6 h-6 rounded-lg shadow-inner flex-shrink-0 border border-black/10" 
                                                                style={{ background: preset.value }}
                                                            />
                                                            <span className="text-[11px] font-semibold text-slate-800 truncate">{preset.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Custom CSS Gradient input */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                    Custom CSS Gradient
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.bg_gradient || ''}
                                                    onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })}
                                                    placeholder="linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)"
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>

                                            {/* Live Swatch Banner */}
                                            <div 
                                                className="h-12 w-full rounded-xl border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase"
                                                style={{ background: formData.bg_gradient || 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)' }}
                                            >
                                                Active Gradient Swatch
                                            </div>
                                        </div>
                                    )}

                                    {/* OPTION 2: IMAGE BACKGROUND SETTINGS */}
                                    {formData.bg_type === 'image' && (
                                        <div className="space-y-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                                            <div>
                                                <label className="block font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1.5">
                                                    <UploadCloud className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>Upload Background Image File</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleBgFileChange}
                                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                                                />
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    Supported formats: JPG, PNG, WEBP (Recommended: 1920x1080 or HD abstract backdrop)
                                                </p>
                                            </div>

                                            {/* Direct URL Input */}
                                            <div>
                                                <label className="block font-bold text-slate-700 text-[11px] mb-1">
                                                    Or Direct Image URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.bg_image || ''}
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        setFormData({ ...formData, bg_image: url, delete_bg_image: false });
                                                        setBgImagePreview(url || null);
                                                    }}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>

                                            {/* Image Presets */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                                                    Curated Studio Presets
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {IMAGE_PRESETS.map((preset, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, bg_image: preset.url, bg_image_file: null, delete_bg_image: false, bg_type: 'image' });
                                                                setBgImagePreview(preset.url);
                                                            }}
                                                            className="relative h-14 rounded-xl overflow-hidden border border-slate-200 hover:border-slate-400 group transition-all"
                                                        >
                                                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                            <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                                                                <span className="text-[9px] font-bold text-white leading-tight line-clamp-1">{preset.label}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Current Image Preview & Removal */}
                                            {bgImagePreview && (
                                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <img
                                                            src={bgImagePreview}
                                                            alt="Background Preview"
                                                            className="w-14 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                                                                <Check className="w-3 h-3" /> Active Background
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                                                                {formData.bg_image_file ? formData.bg_image_file.name : (formData.bg_image || 'Uploaded Image')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveBgImage}
                                                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* OPTION 3: SOLID COLOR */}
                                    {formData.bg_type === 'color' && (
                                        <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                                            <label className="block text-[11px] font-bold text-slate-700">
                                                Background Solid Color
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={formData.bg_color || '#070709'}
                                                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                                                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.bg_color || '#070709'}
                                                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                                                    placeholder="#070709"
                                                    className="w-36 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* AMBIENT MOOD & WATERMARK */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Atmosphere & Lighting</span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Color Mood (Tailwind Classes)</label>
                                                <input
                                                    type="text"
                                                    value={formData.theme_color_mood}
                                                    onChange={(e) => setFormData({ ...formData, theme_color_mood: e.target.value })}
                                                    placeholder="from-[#3b061d] via-[#1a020d] to-black"
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Light Mood (Tailwind Classes)</label>
                                                <input
                                                    type="text"
                                                    value={formData.theme_light_mood}
                                                    onChange={(e) => setFormData({ ...formData, theme_light_mood: e.target.value })}
                                                    placeholder="from-[#ffeef6] via-[#fcf0f5] to-white"
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Watermark Typography</label>
                                                <input
                                                    type="text"
                                                    value={formData.theme_watermark}
                                                    onChange={(e) => setFormData({ ...formData, theme_watermark: e.target.value })}
                                                    placeholder="e.g. CYBER SAMURAI / TOKYO STREET"
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* LIVE PRODUCT STAGE MOCKUP PREVIEW */}
                                    <div className="pt-3 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                <span>Live Storefront Mockup Preview</span>
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">REALTIME</span>
                                        </div>
                                        <div 
                                            className="relative h-44 rounded-2xl overflow-hidden border border-slate-800/20 shadow-xl flex items-center justify-center p-4"
                                            style={
                                                formData.bg_type === 'image' && (bgImagePreview || formData.bg_image)
                                                    ? {
                                                        backgroundImage: `url("${bgImagePreview || formData.bg_image}")`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }
                                                    : formData.bg_type === 'color'
                                                    ? { backgroundColor: formData.bg_color || '#070709' }
                                                    : { background: formData.bg_gradient || 'linear-gradient(135deg, #1e1035 0%, #0d0614 50%, #070709 100%)' }
                                            }
                                        >
                                            {/* Backdrop overlay */}
                                            <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
                                            
                                            {/* Watermark in background */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                                                <span className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase text-white/[0.07] whitespace-nowrap">
                                                    {formData.theme_watermark || formData.title || 'M3S STREETWEAR'}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-10 flex items-center gap-4 bg-[#0c0d12]/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full">
                                                {thumbnailPreview || formData.thumbnail ? (
                                                    <img
                                                        src={thumbnailPreview || formData.thumbnail}
                                                        alt="preview"
                                                        className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/40">
                                                        <Image className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <span className="text-[9px] font-mono font-bold tracking-widest text-pink-400 uppercase">
                                                        {formData.bg_type.toUpperCase()} THEME
                                                    </span>
                                                    <h5 className="text-xs font-bold text-white truncate">
                                                        {formData.title || 'Product Title'}
                                                    </h5>
                                                    <p className="text-xs font-mono font-bold text-zinc-300 mt-0.5">
                                                        ${formData.price || '0.00'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* EDITORIAL FASHION SPECIFICATIONS */}
                            {activeTab === 'specs' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Fabric</label>
                                            <input type="text" value={formData.fabric} onChange={(e) => setFormData({ ...formData, fabric: e.target.value })} placeholder="e.g. 100% French Terry Cotton" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Weight (GSM)</label>
                                            <input type="text" value={formData.gsm} onChange={(e) => setFormData({ ...formData, gsm: e.target.value })} placeholder="e.g. 240 GSM" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Fit</label>
                                            <input type="text" value={formData.fit} onChange={(e) => setFormData({ ...formData, fit: e.target.value })} placeholder="e.g. Boxy Oversized Fit" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Neck</label>
                                            <input type="text" value={formData.neck} onChange={(e) => setFormData({ ...formData, neck: e.target.value })} placeholder="e.g. High Ribbed Crewneck" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Care Instructions</label>
                                        <textarea value={formData.care_instructions} onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })} placeholder="e.g. Machine wash cold, do not tumble dry..." rows="3" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"></textarea>
                                    </div>
                                </div>
                            )}

                            {/* SEO & METADATA */}
                            {activeTab === 'seo' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">SEO Title</label>
                                        <input type="text" value={formData.seo_title} onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })} placeholder="Optimal title for Google..." className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">SEO Description</label>
                                        <textarea value={formData.seo_desc} onChange={(e) => setFormData({ ...formData, seo_desc: e.target.value })} placeholder="Meta description for search engines..." rows="3" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"></textarea>
                                    </div>
                                </div>
                            )}
                            
                            {/* SETTINGS / STATUS */}
                            {activeTab === 'advanced' && (
                                <div className="space-y-4 animate-fade-in">
                                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                        <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded text-slate-900" />
                                        <span>Active (Published in store)</span>
                                    </label>

                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="rounded text-slate-900"
                                    />
                                    <span>Featured on Homepage</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_trending}
                                        onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                                        className="rounded text-slate-900"
                                    />
                                    <span>Trending / Best Seller</span>
                                </label>
                            </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-sm"
                                >
                                    {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
