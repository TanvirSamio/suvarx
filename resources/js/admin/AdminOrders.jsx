import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { 
    Search, 
    ShoppingCart, 
    Truck, 
    CheckCircle2, 
    Clock, 
    X, 
    Eye, 
    Printer, 
    MapPin, 
    Phone, 
    Mail, 
    Save, 
    SlidersHorizontal,
    FileText
} from 'lucide-react';

const statusOptions = ['pending', 'processing', 'in_warehouse', 'shipped', 'delivered', 'cancelled', 'refunded'];

export const AdminOrders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { formatPrice, settings } = useSettings();
    const { showToast } = useCart();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Details Modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/api/admin/orders?page=${page}`;
            if (statusFilter && statusFilter !== 'all') url += `&status=${statusFilter}`;
            if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

            const res = await axios.get(url);
            setOrders(res.data.data || []);
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
        fetchOrders(1);
    }, [statusFilter, search]);

    const handleOpenOrder = (ord) => {
        setSelectedOrder(ord);
        setOrderStatus(ord.order_status || 'pending');
        setPaymentStatus(ord.payment_status || 'pending');
        setTrackingNumber(ord.tracking_number || '');
        setAdminNotes(ord.admin_notes || '');
    };

    const handleSaveStatus = async (e) => {
        e.preventDefault();
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            const res = await axios.put(`/api/admin/orders/${selectedOrder.id}/status`, {
                order_status: orderStatus,
                payment_status: paymentStatus,
                tracking_number: trackingNumber,
                admin_notes: adminNotes,
            });
            showToast('Order updated successfully!', 'success');
            setSelectedOrder(res.data.order);
            fetchOrders(pagination.current_page);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update order', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Order Management & Invoices
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Track customer orders, update tracking numbers, and manage fulfillment
                    </p>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'processing', 'in_warehouse', 'shipped', 'delivered', 'cancelled'].map(st => (
                    <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all ${
                            statusFilter === st
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {st}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, phone or tracking code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-4">Order ID</th>
                            <th className="py-3.5 px-4">Customer</th>
                            <th className="py-3.5 px-4">Date</th>
                            <th className="py-3.5 px-4">Items</th>
                            <th className="py-3.5 px-4">Total</th>
                            <th className="py-3.5 px-4">Payment</th>
                            <th className="py-3.5 px-4">Order Status</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-slate-400">Loading orders...</td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-slate-900">{order.order_number}</td>
                                    <td className="py-3.5 px-4">
                                        <div className="font-extrabold text-slate-900">{order.customer_name}</div>
                                        <div className="text-[11px] text-slate-400">{order.customer_phone}</div>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                                        {order.items?.length || 0} items
                                    </td>
                                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                                        {formatPrice(order.total_amount)}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                            order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.order_status === 'in_warehouse' ? 'bg-purple-100 text-purple-800' :
                                            order.order_status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => handleOpenOrder(order)}
                                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-slate-400">No orders found matching filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details & Management Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in print:p-0">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col print:border-none print:shadow-none print:max-w-none">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between print:hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        Order {selectedOrder.order_number}
                                    </h3>
                                    <span className="text-xs text-slate-400">
                                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrintInvoice}
                                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                                </button>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-xs">
                            {/* Customer & Address Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2">Customer & Delivery</h4>
                                    <p className="font-bold text-slate-800">{selectedOrder.customer_name}</p>
                                    <p className="text-slate-600">{selectedOrder.shipping_address}</p>
                                    <p className="text-slate-600">{selectedOrder.shipping_city}, {selectedOrder.shipping_postal}</p>
                                    <p className="text-slate-600 mt-1">Phone: {selectedOrder.customer_phone}</p>
                                    <p className="text-slate-600">Email: {selectedOrder.customer_email}</p>
                                </div>

                                <div>
                                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2">Order Info</h4>
                                    <p className="text-slate-600">Payment: <strong className="uppercase text-slate-900">{selectedOrder.payment_method.replace('_', ' ')}</strong></p>
                                    <p className="text-slate-600">Shipping: {selectedOrder.shipping_method}</p>
                                    {selectedOrder.shipping_notes && (
                                        <p className="text-slate-600 mt-1 italic">Notes: "{selectedOrder.shipping_notes}"</p>
                                    )}
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div>
                                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">Order Items</h4>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                                            <div className="flex items-center gap-3">
                                                {item.product_thumbnail && (
                                                    <img src={item.product_thumbnail} alt="" className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1" />
                                                )}
                                                <div>
                                                    <h5 className="font-bold text-slate-900">{item.product_title}</h5>
                                                    <span className="text-[11px] text-slate-400">Qty: {item.quantity} x {formatPrice(item.unit_price)}</span>
                                                </div>
                                            </div>
                                            <span className="font-extrabold text-slate-900">{formatPrice(item.total_price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals Summary */}
                            <div className="space-y-1.5 max-w-xs ml-auto text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-bold text-slate-900">{formatPrice(selectedOrder.subtotal)}</span>
                                </div>
                                {Number(selectedOrder.discount_amount) > 0 && (
                                    <div className="flex justify-between text-emerald-700">
                                        <span>Discount:</span>
                                        <span>-{formatPrice(selectedOrder.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{Number(selectedOrder.shipping_fee) === 0 ? 'FREE' : formatPrice(selectedOrder.shipping_fee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>{formatPrice(selectedOrder.tax_amount)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                                    <span>Total:</span>
                                    <span>{formatPrice(selectedOrder.total_amount)}</span>
                                </div>
                            </div>

                            {/* Status Control Form (Hidden on print) */}
                            <form onSubmit={handleSaveStatus} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 print:hidden">
                                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">
                                    Update Order Status & Tracking
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Delivery / Order Status</label>
                                        <select
                                            value={orderStatus}
                                            onChange={(e) => setOrderStatus(e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold uppercase text-slate-800 focus:outline-none cursor-pointer"
                                        >
                                            {statusOptions.map(st => (
                                                <option key={st} value={st}>{st.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                                        <select
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold uppercase text-slate-800 focus:outline-none cursor-pointer"
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="paid">PAID</option>
                                            <option value="refunded">REFUNDED</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">Courier Tracking Code</label>
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="e.g. TRK-US-928104"
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-700 mb-1">Internal Admin Notes</label>
                                        <textarea
                                            rows={2}
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            placeholder="e.g. Courier picked up package at 4 PM"
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    {isUpdating ? 'Saving...' : 'Save Order Updates'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
