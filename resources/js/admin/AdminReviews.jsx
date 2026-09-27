import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from 'lucide-react';

export const AdminReviews = () => {
    const { showToast } = useCart();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/reviews');
            setReviews(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleToggleApproval = async (id) => {
        try {
            const res = await axios.post(`/api/admin/reviews/${id}/toggle-approval`);
            showToast('Review approval status toggled', 'success');
            fetchReviews();
        } catch (err) {
            showToast('Failed to toggle review', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer review?')) return;
        try {
            await axios.delete(`/api/admin/reviews/${id}`);
            showToast('Review deleted', 'info');
            fetchReviews();
        } catch (err) {
            showToast('Failed to delete review', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Customer Reviews & Moderation
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Moderate product feedback, star ratings, and testimonials
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Product</th>
                            <th className="py-3.5 px-4">Customer</th>
                            <th className="py-3.5 px-4">Rating</th>
                            <th className="py-3.5 px-4">Review Content</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">Loading reviews...</td>
                            </tr>
                        ) : reviews.length > 0 ? (
                            reviews.map(rev => (
                                <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="font-extrabold text-slate-900 max-w-xs truncate">
                                            {rev.product?.title || 'Product'}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className="font-bold text-slate-900 block">{rev.customer_name}</span>
                                        <span className="text-[11px] text-slate-400">{rev.customer_email || 'Verified Buyer'}</span>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center text-amber-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${
                                                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 max-w-sm">
                                        {rev.title && <h5 className="font-bold text-slate-800">{rev.title}</h5>}
                                        <p className="text-slate-600 line-clamp-2 text-[11px]">{rev.comment}</p>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            rev.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {rev.is_approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleApproval(rev.id)}
                                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                                                    rev.is_approved
                                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                                }`}
                                            >
                                                {rev.is_approved ? 'Hide' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rev.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">No reviews submitted yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
