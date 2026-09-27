import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Edit, Trash2, X, HelpCircle, Check } from 'lucide-react';

export const AdminFaq = () => {
    const { showToast } = useCart();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        display_order: 0,
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/faqs');
            setFaqs(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleOpenCreate = () => {
        setEditingFaq(null);
        setFormData({
            question: '',
            answer: '',
            display_order: faqs.length + 1,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (f) => {
        setEditingFaq(f);
        setFormData({
            question: f.question || '',
            answer: f.answer || '',
            display_order: f.display_order || 0,
            is_active: Boolean(f.is_active),
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingFaq) {
                await axios.put(`/api/admin/faqs/${editingFaq.id}`, formData);
                showToast('FAQ updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/faqs', formData);
                showToast('FAQ created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchFaqs();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save FAQ', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, question) => {
        if (!window.confirm(`Delete FAQ "${question}"?`)) return;
        try {
            await axios.delete(`/api/admin/faqs/${id}`);
            showToast('FAQ deleted', 'info');
            fetchFaqs();
        } catch (err) {
            showToast('Failed to delete FAQ', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage the FAQ accordion items shown on the homepage.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Order</th>
                            <th className="py-3.5 px-4">Question</th>
                            <th className="py-3.5 px-4">Answer Preview</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">Loading FAQs...</td>
                            </tr>
                        ) : faqs.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold">{f.display_order}</td>
                                <td className="py-3.5 px-4 font-extrabold text-slate-900">{f.question}</td>
                                <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate">{f.answer}</td>
                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        f.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {f.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleOpenEdit(f)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(f.id, f.question)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
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
                                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Question *</label>
                                    <input type="text" required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Answer *</label>
                                    <textarea required rows={4} value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
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
                                    <span>{submitting ? 'Saving...' : 'Save FAQ'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
