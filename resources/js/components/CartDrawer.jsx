import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { 
    X, 
    Trash2, 
    ShoppingBag, 
    Sparkles, 
    Truck, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

export const CartDrawer = () => {
    const { 
        cart, 
        isCartOpen, 
        setIsCartOpen, 
        isCheckoutOpen,
        setIsCheckoutOpen,
        updateQuantity, 
        removeFromCart, 
        clearCart,
        subtotal, 
        totalItemsCount,
        isFreeShipping,
        discountAmount,
        grandTotal,
        coupon,
        shippingFee,
        showToast
    } = useCart();

    const { user } = useAuth();
    const { formatPrice } = useSettings();
    const navigate = useNavigate();

    // 4 Form fields ONLY
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-populate from logged-in user if available
    useEffect(() => {
        if (user) {
            if (!name && user.name) setName(user.name);
            if (!phone && user.phone) setPhone(user.phone);
            if (!email && user.email) setEmail(user.email);
            if (!address && user.address) setAddress(user.address);
        }
    }, [user]);

    if (!isCartOpen) return null;

    const handleClose = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            showToast('Your cart is empty. Please select a product first.', 'error');
            return;
        }

        if (!name.trim()) {
            showToast('Please enter your Name.', 'error');
            return;
        }

        if (!phone.trim()) {
            showToast('Please enter your Phone Number.', 'error');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            showToast('Please enter a valid Email Address.', 'error');
            return;
        }

        if (!address.trim()) {
            showToast('Please enter your Delivery Address.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer_name: name.trim(),
                customer_phone: phone.trim(),
                customer_email: email.trim(),
                shipping_address: address.trim(),
                shipping_city: 'Dhaka, Bangladesh',
                shipping_method: isFreeShipping ? 'Free Standard Delivery' : 'Standard Delivery',
                payment_method: 'cash_on_delivery',
                coupon_code: coupon ? coupon.code : null,
                items: cart.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    options: item.options,
                })),
            };

            const res = await axios.post('/api/orders/create', orderPayload);

            if (res.data.success) {
                try {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                } catch (err) {}

                const createdOrder = res.data.order;
                clearCart();
                handleClose();
                navigate(`/order-success/${createdOrder.order_number}`);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to place order. Please check your information.';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                onClick={handleClose}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            />

            {/* Slide-over Drawer from Right */}
            <div className="relative w-full max-w-md bg-[#0c0d14] border-l border-white/10 h-full shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col z-10 animate-slide-left text-white overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-white/10 bg-[#12131d] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-heading font-extrabold text-white text-sm uppercase tracking-wider">
                                    Quick Checkout
                                </h3>
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    COD
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-400">
                                Cash on Delivery • ক্যাশ অন ডেলিভারি
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-zinc-400 mx-auto flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-extrabold uppercase text-white">Your bag is empty</h4>
                            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                                Please select a product to place an order.
                            </p>
                            <Link
                                to="/shop"
                                onClick={handleClose}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all mt-2"
                            >
                                Shop Products <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Selected Items Summary */}
                            <div className="p-3.5 bg-[#12131d] rounded-2xl border border-white/10 space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    <span>Selected Items ({totalItemsCount})</span>
                                    <span className="font-mono text-pink-400">{formatPrice(subtotal)}</span>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {cart.map((item, index) => (
                                        <div 
                                            key={index}
                                            className="flex gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 items-center justify-between"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-white/10">
                                                <img
                                                    src={item.product.thumbnail || item.product.gallery?.[0]}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 px-1">
                                                <h5 className="text-[11px] font-bold text-white truncate">
                                                    {item.product.title}
                                                </h5>
                                                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                                                    <span>{formatPrice(item.product.price)}</span>
                                                    {item.options?.size && <span>• {item.options.size}</span>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {/* Stepper */}
                                                <div className="flex items-center border border-white/15 rounded-lg bg-black/40 text-[10px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(index, item.quantity - 1)}
                                                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-5 text-center font-mono font-bold text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(index, item.quantity + 1)}
                                                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(index)}
                                                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ONLY 4 FIELDS: Name, Phone, Email, Address */}
                            <form id="express-checkout-form" onSubmit={handlePlaceOrder} className="space-y-3">
                                <div className="p-4 bg-[#12131d] rounded-2xl border border-white/10 space-y-3">
                                    <div className="flex items-center gap-1.5 pb-1 border-b border-white/10">
                                        <Truck className="w-3.5 h-3.5 text-pink-400" />
                                        <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider">
                                            Delivery Information
                                        </h4>
                                    </div>

                                    {/* 1. NAME */}
                                    <div>
                                        <label className="block font-bold text-zinc-300 mb-1 text-[11px] flex items-center gap-1.5">
                                            <User className="w-3 h-3 text-zinc-400" />
                                            <span>Full Name *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="আপনার পুরো নাম লিখুন (e.g. Tanvir Sami)"
                                            className="w-full px-3.5 py-2.5 bg-[#171824] border border-white/15 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white placeholder:text-zinc-500"
                                        />
                                    </div>

                                    {/* 2. PHONE NUMBER */}
                                    <div>
                                        <label className="block font-bold text-zinc-300 mb-1 text-[11px] flex items-center gap-1.5">
                                            <Phone className="w-3 h-3 text-zinc-400" />
                                            <span>Phone Number *</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="১১ ডিজিটের মোবাইল নম্বর (e.g. 017XXXXXXXX)"
                                            className="w-full px-3.5 py-2.5 bg-[#171824] border border-white/15 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white placeholder:text-zinc-500 font-mono"
                                        />
                                    </div>

                                    {/* 3. EMAIL */}
                                    <div>
                                        <label className="block font-bold text-zinc-300 mb-1 text-[11px] flex items-center gap-1.5">
                                            <Mail className="w-3 h-3 text-zinc-400" />
                                            <span>Email *</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ইমেইল অ্যাড্রেস (e.g. user@gmail.com)"
                                            className="w-full px-3.5 py-2.5 bg-[#171824] border border-white/15 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white placeholder:text-zinc-500"
                                        />
                                    </div>

                                    {/* 4. ADDRESS */}
                                    <div>
                                        <label className="block font-bold text-zinc-300 mb-1 text-[11px] flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 text-zinc-400" />
                                            <span>Delivery Address *</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা/থানা/জেলা)"
                                            className="w-full px-3.5 py-2.5 bg-[#171824] border border-white/15 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white placeholder:text-zinc-500 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Trust Note */}
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-[11px] text-emerald-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>
                                        ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন।
                                    </span>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Footer with Price & Submit */}
                {cart.length > 0 && (
                    <div className="p-4 sm:p-5 border-t border-white/10 bg-[#12131d] space-y-3 shrink-0">
                        <div className="space-y-1 text-xs text-zinc-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-mono font-bold text-white">{formatPrice(subtotal)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-400 font-bold">
                                    <span>Discount</span>
                                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>{isFreeShipping ? <strong className="text-emerald-400 uppercase font-bold">FREE</strong> : <span className="font-mono font-bold text-white">{formatPrice(shippingFee)}</span>}</span>
                            </div>

                            <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-extrabold text-white">
                                <span>Total Amount</span>
                                <span className="text-lg font-mono font-extrabold text-white text-pink-400">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="express-checkout-form"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Placing Order...</span>
                                </div>
                            ) : (
                                <>
                                    <span>CONFIRM ORDER • {formatPrice(grandTotal)}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
