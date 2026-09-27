import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { 
    Search, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    AlertCircle,
    ShoppingBag,
    Phone
} from 'lucide-react';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', desc: 'Order received and waiting for confirmation' },
    { key: 'processing', label: 'Processing', desc: 'Items packed and prepared for courier dispatch' },
    { key: 'in_warehouse', label: 'In Warehouse', desc: 'Order is ready in our warehouse awaiting pickup' },
    { key: 'shipped', label: 'Shipped & In Transit', desc: 'Package handed over to courier partner' },
    { key: 'delivered', label: 'Delivered', desc: 'Package successfully delivered to customer' },
];

export const OrderTracking = () => {
    const [searchParams] = useSearchParams();
    const { formatPrice } = useSettings();

    const [orderCode, setOrderCode] = useState(searchParams.get('code') || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrderDetails = async (codeToSearch) => {
        if (!codeToSearch.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/orders/track', { order_number: codeToSearch.trim() });
            if (res.data.success) {
                setOrder(res.data.order);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'No order found with this tracking number');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialCode = searchParams.get('code');
        if (initialCode) {
            setOrderCode(initialCode);
            fetchOrderDetails(initialCode);
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrderDetails(orderCode);
    };

    const getStepStatus = (stepKey, currentStatus) => {
        const orderIndex = statusSteps.findIndex(s => s.key === currentStatus);
        const stepIndex = statusSteps.findIndex(s => s.key === stepKey);

        if (currentStatus === 'cancelled') return 'cancelled';
        if (stepIndex < orderIndex) return 'completed';
        if (stepIndex === orderIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header & Search */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-subtle text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center">
                    <Truck className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Track Your Order Live
                    </h1>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Enter your Order Number (e.g. <strong>SVX-92810</strong>) or Courier Tracking Code to check real-time status.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        <input
                            type="text"
                            required
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            placeholder="Enter Order # or Tracking Code"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-2xl text-xs transition-all shadow-md"
                    >
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl max-w-md mx-auto flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Tracking Results */}
            {order && (
                <div className="space-y-6 animate-fade-in">
                    {/* Status Progress Timeline */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order ID</span>
                                <h3 className="text-xl font-extrabold text-slate-900">{order.order_number}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500">
                                    Placed: {new Date(order.created_at).toLocaleDateString()}
                                </span>
                                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full uppercase">
                                    {order.order_status}
                                </span>
                            </div>
                        </div>

                        {/* Step Timeline Indicator */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                            {statusSteps.map((step, idx) => {
                                const statusState = getStepStatus(step.key, order.order_status);
                                return (
                                    <div key={idx} className="flex flex-col items-center text-center space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                            statusState === 'completed' ? 'bg-emerald-500 text-white shadow-sm' :
                                            statusState === 'current' ? 'bg-slate-900 text-white ring-4 ring-slate-900/10' :
                                            'bg-slate-200 text-slate-500'
                                        }`}>
                                            {statusState === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-900">{step.label}</h4>
                                        <p className="text-[11px] text-slate-400 leading-tight">{step.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Details & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destination */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-3 text-xs text-slate-600">
                            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-700" />
                                Delivery Destination
                            </h4>
                            <p className="font-bold text-slate-800">{order.customer_name}</p>
                            <p>{order.shipping_address}</p>
                            <p>{order.shipping_city}, {order.shipping_postal}</p>
                            <p className="pt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {order.customer_phone}</p>
                            {order.tracking_number && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold mt-2">
                                    Courier Tracking Code: {order.tracking_number}
                                </div>
                            )}
                        </div>

                        {/* Items in Package */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-3 text-xs">
                            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-slate-700" />
                                Items in Package ({order.items?.length || 0})
                            </h4>
                            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="py-2 flex items-center justify-between">
                                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{item.product_title}</span>
                                        <span className="font-bold text-slate-900">Qty: {item.quantity} • {formatPrice(item.total_price)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex justify-between font-extrabold text-sm text-slate-900">
                                <span>Total Paid</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
