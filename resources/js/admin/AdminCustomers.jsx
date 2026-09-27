import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Search, Users, ShieldAlert, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const AdminCustomers = () => {
    const { showToast } = useCart();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/api/admin/customers?page=${page}`;
            if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
            const res = await axios.get(url);
            setCustomers(res.data.data || []);
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

    useEffect(() => {
        fetchCustomers(1);
    }, [search]);

    const handleToggleStatus = async (id, name) => {
        try {
            const res = await axios.post(`/api/admin/customers/${id}/toggle-status`);
            showToast(res.data.message || `Customer status updated`, 'success');
            fetchCustomers(pagination.current_page);
        } catch (err) {
            showToast('Failed to update customer status', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Customer Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage registered client accounts and activity status
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search by customer name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Customer</th>
                            <th className="py-3.5 px-4">Contact Info</th>
                            <th className="py-3.5 px-4">City</th>
                            <th className="py-3.5 px-4">Total Orders</th>
                            <th className="py-3.5 px-4">Account Status</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">Loading customers...</td>
                            </tr>
                        ) : customers.length > 0 ? (
                            customers.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0">
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-slate-900 block">{c.name}</span>
                                                <span className="text-[11px] text-slate-400">Member since {new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}</div>
                                        {c.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}</div>}
                                    </td>

                                    <td className="py-3.5 px-4 text-slate-700">
                                        {c.city || '—'}
                                    </td>

                                    <td className="py-3.5 px-4 font-bold text-slate-900">
                                        {c.orders_count || 0} orders
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => handleToggleStatus(c.id, c.name)}
                                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                                                c.status === 'active'
                                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            }`}
                                        >
                                            {c.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
