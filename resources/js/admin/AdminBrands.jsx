import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Edit, Trash2, X, Award } from 'lucide-react';

export const AdminBrands = () => {
    const { showToast } = useCart();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        description: '',
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/brands');
            setBrands(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleOpenCreate = () => {
        setEditingBrand(null);
        setFormData({
            name: '',
            logo: '',
            description: '',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (b) => {
        setEditingBrand(b);
        setFormData({
            name: b.name || '',
            logo: b.logo || '',
            description: b.description || '',
            is_active: Boolean(b.is_active),
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingBrand) {
                await axios.put(`/api/admin/brands/${editingBrand.id}`, formData);
                showToast('Brand updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/brands', formData);
                showToast('Brand created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchBrands();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save brand', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete brand "${name}"?`)) return;
        try {
            await axios.delete(`/api/admin/brands/${id}`);
            showToast('Brand deleted', 'info');
            fetchBrands();
        } catch (err) {
            showToast('Failed to delete brand', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Brand Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage manufacturers, logos, and brand partnerships
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Brand</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Brand</th>
                            <th className="py-3.5 px-4">Slug</th>
                            <th className="py-3.5 px-4">Products</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">Loading brands...</td>
                            </tr>
                        ) : brands.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0 overflow-hidden">
                                            {b.logo ? (
                                                <img src={b.logo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Award className="w-5 h-5 text-slate-500" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-slate-900 block">{b.name}</span>
                                            <span className="text-[11px] text-slate-400">{b.description || 'Verified manufacturer'}</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-500">{b.slug}</td>
                                <td className="py-3.5 px-4 font-bold text-slate-900">{b.products_count || 0} items</td>
                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {b.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(b)}
                                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id, b.name)}
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
                                {editingBrand ? 'Edit Brand' : 'Create Brand'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Sony"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Logo URL</label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
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
                                    placeholder="Brief brand overview"
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
                                    {submitting ? 'Saving...' : 'Save Brand'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
