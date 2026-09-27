import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { 
    DollarSign, 
    ShoppingCart, 
    Package, 
    Users, 
    AlertTriangle, 
    TrendingUp, 
    ArrowUpRight, 
    Clock, 
    Truck, 
    CheckCircle2, 
    ExternalLink,
    ChevronRight
} from 'lucide-react';

export const AdminDashboard = () => {
    const { formatPrice } = useSettings();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('/api/admin/dashboard');
            setData(res.data);
        } catch (err) {
            console.error('Failed to load dashboard statistics', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-500">Loading CMS metrics...</p>
            </div>
        );
    }

    const stats = data?.stats || {};
    const lowStock = data?.lowStockProducts || [];
    const recentOrders = data?.recentOrders || [];
    const ordersByStatus = data?.ordersByStatus || {};

    return (
        <div className="space-y-8">
            {/* Title & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Overview & Analytics
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Live snapshot of your e-commerce store performance
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/products"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                        + Add New Product
                    </Link>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Revenue */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                            {formatPrice(stats.totalRevenue || 0)}
                        </h3>
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> From paid verified orders
                        </p>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                            {stats.totalOrders || 0}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1">
                            <strong>{stats.pendingOrders || 0}</strong> awaiting processing
                        </p>
                    </div>
                </div>

                {/* Total Products */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Products in Catalog</span>
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                            {stats.totalProducts || 0}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1">
                            {lowStock.length > 0 ? (
                                <span className="text-amber-600 font-semibold">⚠️ {lowStock.length} Low Stock Alert</span>
                            ) : (
                                'All inventory healthy'
                            )}
                        </p>
                    </div>
                </div>

                {/* Customers */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customers</span>
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                            {stats.totalCustomers || 0}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1">
                            Registered client accounts
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link to="/admin/orders?status=pending" className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 shadow-subtle transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">Pending</span>
                        <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">{ordersByStatus.pending || 0}</span>
                </Link>
                <Link to="/admin/orders?status=processing" className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 shadow-subtle transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">Processing</span>
                        <Package className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">{ordersByStatus.processing || 0}</span>
                </Link>
                <Link to="/admin/orders?status=shipped" className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 shadow-subtle transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">In Transit</span>
                        <Truck className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">{ordersByStatus.shipped || 0}</span>
                </Link>
                <Link to="/admin/orders?status=delivered" className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-400 shadow-subtle transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">Delivered</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">{ordersByStatus.delivered || 0}</span>
                </Link>
            </div>

            {/* 2-Column Section: Low Stock Warning + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-base font-extrabold text-slate-900">
                            Recent Orders
                        </h3>
                        <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                            View all orders <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Total</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.map(ord => (
                                    <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 font-bold text-slate-900">{ord.order_number}</td>
                                        <td className="py-3">
                                            <div className="font-semibold text-slate-800">{ord.customer_name}</div>
                                            <div className="text-[11px] text-slate-400">{ord.customer_email}</div>
                                        </td>
                                        <td className="py-3 text-slate-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 font-extrabold text-slate-900">{formatPrice(ord.total_amount)}</td>
                                        <td className="py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                ord.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                ord.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                ord.order_status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>
                                                {ord.order_status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <Link
                                                to={`/admin/orders?search=${ord.order_number}`}
                                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[11px] transition-colors"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Warning (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-base font-extrabold text-slate-900">
                            Low Stock Alerts
                        </h3>
                    </div>

                    {lowStock.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {lowStock.map(item => (
                                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <img
                                            src={item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                                            alt=""
                                            className="w-9 h-9 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                                            <span className="text-[11px] text-slate-400">SKU: {item.sku}</span>
                                        </div>
                                    </div>

                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 shrink-0">
                                        {item.stock_quantity} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-xs text-slate-400">
                            All products have sufficient stock levels.
                        </div>
                    )}

                    <Link
                        to="/admin/products"
                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                        Manage Product Inventory <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
