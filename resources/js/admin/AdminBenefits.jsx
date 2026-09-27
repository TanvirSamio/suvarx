import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Edit, Trash2, X, BookOpen, Check } from 'lucide-react';

export const AdminBenefits = () => {
    const { showToast } = useCart();
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBenefit, setEditingBenefit] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        old_text: '',
        new_text: '',
        bg_color: '#000000',
        display_order: 0,
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchBenefits = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/benefits');
            setBenefits(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    const handleOpenCreate = () => {
        setEditingBenefit(null);
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            old_text: '',
            new_text: '',
            bg_color: '#000000',
            display_order: benefits.length + 1,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (b) => {
        setEditingBenefit(b);
        setFormData({
            title: b.title || '',
            subtitle: b.subtitle || '',
            description: b.description || '',
            old_text: b.old_text || '',
            new_text: b.new_text || '',
            bg_color: b.bg_color || '#000000',
            display_order: b.display_order || 0,
            is_active: Boolean(b.is_active),
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingBenefit) {
                await axios.put(`/api/admin/benefits/${editingBenefit.id}`, formData);
                showToast('Benefit updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/benefits', formData);
                showToast('Benefit created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchBenefits();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save benefit', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete benefit "${title}"?`)) return;
        try {
            await axios.delete(`/api/admin/benefits/${id}`);
            showToast('Benefit deleted', 'info');
            fetchBenefits();
        } catch (err) {
            showToast('Failed to delete benefit', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Home Benefits (Story Panels)
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage the GSAP-animated horizontal scroll story panels on the homepage.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Benefit</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Order</th>
                            <th className="py-3.5 px-4">Title</th>
                            <th className="py-3.5 px-4">Old/New Text</th>
                            <th className="py-3.5 px-4">Color</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">Loading benefits...</td>
                            </tr>
                        ) : benefits.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold">{b.display_order}</td>
                                <td className="py-3.5 px-4">
                                    <span className="font-extrabold text-slate-900 block">{b.title}</span>
                                    <span className="text-[11px] text-slate-400">{b.subtitle}</span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">
                                    <div className="line-through text-rose-500">{b.old_text}</div>
                                    <div className="text-emerald-600 font-bold">{b.new_text}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.bg_color }}></div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {b.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(b.id, b.title)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-extrabold text-slate-900">
                                {editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Title *</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                                    <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                                    <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Old Text (Strikethrough)</label>
                                    <input type="text" value={formData.old_text} onChange={(e) => setFormData({ ...formData, old_text: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-rose-500" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">New Text (Highlight)</label>
                                    <input type="text" value={formData.new_text} onChange={(e) => setFormData({ ...formData, new_text: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600 font-bold" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Background Color</label>
                                    <input type="color" value={formData.bg_color} onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })} className="h-10 w-full rounded-xl cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                                    <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded text-slate-900" />
                                    <span>Active</span>
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                                    <Check className="w-4 h-4" />
                                    <span>{submitting ? 'Saving...' : 'Save Benefit'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
