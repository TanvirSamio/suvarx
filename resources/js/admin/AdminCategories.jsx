import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { 
    Plus, 
    Edit, 
    Trash2, 
    X, 
    Layers, 
    Laptop, 
    Smartphone, 
    Headphones, 
    Watch, 
    Camera, 
    Gamepad2,
    Check
} from 'lucide-react';

const iconOptions = ['Laptop', 'Smartphone', 'Headphones', 'Watch', 'Camera', 'Gamepad2'];

export const AdminCategories = () => {
    const { showToast } = useCart();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: 'Laptop',
        image: '',
        description: '',
        is_featured: true,
        is_active: true,
        sort_order: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/categories');
            setCategories(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            icon: 'Laptop',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            description: '',
            is_featured: true,
            is_active: true,
            sort_order: categories.length + 1,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (c) => {
        setEditingCategory(c);
        setFormData({
            name: c.name || '',
            icon: c.icon || 'Laptop',
            image: c.image || '',
            description: c.description || '',
            is_featured: Boolean(c.is_featured),
            is_active: Boolean(c.is_active),
            sort_order: c.sort_order || 0,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                await axios.put(`/api/admin/categories/${editingCategory.id}`, formData);
                showToast('Category updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/categories', formData);
                showToast('Category created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save category', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete category "${name}"?`)) return;
        try {
            await axios.delete(`/api/admin/categories/${id}`);
            showToast('Category deleted', 'info');
            fetchCategories();
        } catch (err) {
            showToast('Failed to delete category', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Category Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Create and organize store product categories and icons
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Category</th>
                            <th className="py-3.5 px-4">Slug</th>
                            <th className="py-3.5 px-4">Icon</th>
                            <th className="py-3.5 px-4">Products</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">Loading categories...</td>
                            </tr>
                        ) : categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-slate-900 block">{cat.name}</span>
                                            <span className="text-[11px] text-slate-400 line-clamp-1">{cat.description || 'No description'}</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-500">
                                    {cat.slug}
                                </td>

                                <td className="py-3.5 px-4">
                                    <span className="px-2 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">
                                        {cat.icon || 'Default'}
                                    </span>
                                </td>

                                <td className="py-3.5 px-4">
                                    <span className="font-bold text-slate-900">{cat.products_count || 0} items</span>
                                </td>

                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {cat.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(cat)}
                                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-extrabold text-slate-900">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Laptops & Workstations"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Display Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                                >
                                    {iconOptions.map(ico => (
                                        <option key={ico} value={ico}>{ico}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Category Banner Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief category summary"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
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
                                    {submitting ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
