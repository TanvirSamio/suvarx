import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { 
    Printer, 
    Truck, 
    ArrowRight, 
    Phone, 
    Mail,
} from 'lucide-react';

export const OrderSuccess = () => {
    const { orderNumber } = useParams();
    const { formatPrice } = useSettings();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.post('/api/orders/track', { order_number: orderNumber });
                if (res.data.success) {
                    setOrder(res.data.order);
                }
            } catch (err) {
                console.error('Failed to load order', err);
            } finally {
                setLoading(false);
            }
        };
        if (orderNumber) {
            fetchOrder();
        }
    }, [orderNumber]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                <p className="text-xs text-slate-500 font-mono">Loading receipt...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
                <p className="text-xs text-slate-500 mb-6">We couldn't retrieve the details for order number "{orderNumber}".</p>
                <Link to="/" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 print:p-0">

            {/* Receipt Card — Only this, nothing else */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none">

                {/* Receipt Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Receipt</p>
                        <p className="font-extrabold text-slate-900 text-sm">#{order.order_number}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                        <p>{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-emerald-600 font-bold uppercase mt-0.5">{order.order_status}</p>
                    </div>
                </div>

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-600">
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[10px]">Shipping To</h4>
                        <p className="font-semibold text-slate-800">{order.customer_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_postal}</p>
                        <p className="mt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {order.customer_phone}
                        </p>
                        {order.customer_email && (
                            <p className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> {order.customer_email}
                            </p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[10px]">Payment</h4>
                        <p className="font-semibold uppercase text-slate-800">{order.payment_method.replace('_', ' ')}</p>
                        <p className="text-slate-500 capitalize">{order.payment_status}</p>
                        {order.tracking_number && (
                            <p className="mt-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tracking</span>
                                <strong className="text-blue-600">{order.tracking_number}</strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="border-t border-b border-slate-100 py-4 divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {item.product_thumbnail && (
                                    <img
                                        src={item.product_thumbnail}
                                        alt=""
                                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                                    />
                                )}
                                <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.product_title}</h5>
                                    <span className="text-[11px] text-slate-500">
                                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-900 shrink-0">
                                {formatPrice(item.total_price)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-xs text-slate-600 max-w-xs ml-auto">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    {Number(order.discount_amount) > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                            <span>Discount</span>
                            <span>-{formatPrice(order.discount_amount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{Number(order.shipping_fee) === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span>
                    </div>
                    {Number(order.tax_amount) > 0 && (
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatPrice(order.tax_amount)}</span>
                        </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                        <span>Total</span>
                        <span className="text-lg">{formatPrice(order.total_amount)}</span>
                    </div>
                </div>
            </div>

            {/* Actions — hidden on print */}
            <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Printer className="w-4 h-4" /> Print Receipt
                </button>
                <Link
                    to={`/track-order?code=${order.order_number}`}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Truck className="w-4 h-4" /> Track Order
                </Link>
                <Link
                    to="/"
                    className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};
