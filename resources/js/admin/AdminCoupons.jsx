import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { Plus, Edit, Trash2, X, Tag, Calendar, Check } from 'lucide-react';

export const AdminCoupons = () => {
    const { formatPrice } = useSettings();
    const { showToast } = useCart();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: 10,
        min_spend: 50,
        max_discount: 100,
        usage_limit: 100,
        expires_at: '',
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/coupons');
            setCoupons(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenCreate = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            type: 'percentage',
            value: 10,
            min_spend: 50,
            max_discount: 100,
            usage_limit: 100,
            expires_at: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (c) => {
        setEditingCoupon(c);
        setFormData({
            code: c.code || '',
            type: c.type || 'percentage',
            value: c.value || 0,
            min_spend: c.min_spend || 0,
            max_discount: c.max_discount || '',
            usage_limit: c.usage_limit || '',
            expires_at: c.expires_at ? c.expires_at.split('T')[0] : '',
            is_active: Boolean(c.is_active),
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCoupon) {
                await axios.put(`/api/admin/coupons/${editingCoupon.id}`, formData);
                showToast('Coupon updated successfully!', 'success');
            } else {
                await axios.post('/api/admin/coupons', formData);
                showToast('Coupon created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchCoupons();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save coupon', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, code) => {
        if (!window.confirm(`Delete coupon code "${code}"?`)) return;
        try {
            await axios.delete(`/api/admin/coupons/${id}`);
            showToast('Coupon deleted', 'info');
            fetchCoupons();
        } catch (err) {
            showToast('Failed to delete coupon', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Discount Coupons & Promo Codes
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Create promo discounts, percentage cuts, and spending threshold rules
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Coupon</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Coupon Code</th>
                            <th className="py-3.5 px-4">Discount</th>
                            <th className="py-3.5 px-4">Min Spend</th>
                            <th className="py-3.5 px-4">Usage (Used / Limit)</th>
                            <th className="py-3.5 px-4">Expiry</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400">Loading coupons...</td>
                            </tr>
                        ) : coupons.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-amber-500" />
                                        <span>{c.code}</span>
                                    </div>
                                </td>

                                <td className="py-3.5 px-4 font-bold text-emerald-700">
                                    {c.type === 'percentage' ? `${c.value}% OFF` : `-${formatPrice(c.value)} Fixed`}
                                </td>

                                <td className="py-3.5 px-4 font-semibold text-slate-800">
                                    {Number(c.min_spend) > 0 ? formatPrice(c.min_spend) : 'No Minimum'}
                                </td>

                                <td className="py-3.5 px-4 font-semibold text-slate-700">
                                    {c.used_count || 0} / {c.usage_limit || '∞'}
                                </td>

                                <td className="py-3.5 px-4 text-slate-500">
                                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'No Expiry'}
                                </td>

                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {c.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(c)}
                                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id, c.code)}
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
                                {editingCoupon ? 'Edit Coupon' : 'Create Promo Code'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER25"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        min="0"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Minimum Order Spend ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.min_spend}
                                        onChange={(e) => setFormData({ ...formData, min_spend: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Usage Limit (Max Uses)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value, 10) || '' })}
                                        placeholder="e.g. 500"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
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
                                    {submitting ? 'Saving...' : 'Save Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
