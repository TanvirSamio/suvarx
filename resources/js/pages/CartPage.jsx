import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
    Trash2, 
    ShoppingBag, 
    ArrowRight, 
    Tag, 
    Sparkles, 
    ShieldCheck, 
    ChevronLeft,
    Check,
    X,
    CreditCard,
    Lock,
    Banknote,
    Smartphone,
    CheckCircle2,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Truck,
    ArrowLeft,
    Edit3,
    AlertCircle
} from 'lucide-react';

export const CartPage = () => {
    const { 
        cart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        subtotal, 
        totalItemsCount,
        coupon,
        applyCouponCode,
        removeCoupon,
        discountAmount,
        shippingFee,
        isFreeShipping,
        freeShippingMin,
        taxAmount,
        grandTotal,
        openCheckout,
        showToast
    } = useCart();
    const { user } = useAuth();
    const { formatPrice, settings } = useSettings();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Section view state
    const [showCheckout, setShowCheckout] = useState(
        searchParams.get('checkout') === '1' || searchParams.get('checkout') === 'true'
    );
    const checkoutSectionRef = useRef(null);

    // Promo Code state
    const [couponInput, setCouponInput] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    // Customer & Shipping state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || '');
    const [postalCode, setPostalCode] = useState(user?.postal_code || '');
    const [notes, setNotes] = useState('');
    const [shippingMethod, setShippingMethod] = useState('Standard Delivery');

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardHolder, setCardHolder] = useState(user?.name || '');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill if user logs in
    useEffect(() => {
        if (user) {
            if (!name) setName(user.name || '');
            if (!email) setEmail(user.email || '');
            if (!phone) setPhone(user.phone || '');
            if (!address) setAddress(user.address || '');
            if (!city) setCity(user.city || '');
            if (!postalCode) setPostalCode(user.postal_code || '');
            if (!cardHolder) setCardHolder(user.name || '');
        }
    }, [user]);

    // Handle Promo Code submission
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        setApplyingCoupon(true);
        await applyCouponCode(couponInput);
        setApplyingCoupon(false);
    };

    // Format Card Number (adds spaces every 4 digits)
    const handleCardNumberChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    // Format Card Expiry (MM/YY)
    const handleCardExpiryChange = (e) => {
        let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (raw.length >= 3) {
            raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
        }
        setCardExpiry(raw);
    };

    // Format CVV (3-4 digits)
    const handleCardCvvChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
        setCardCvv(raw);
    };

    // Determine Card Brand
    const getCardBrand = (num) => {
        const clean = num.replace(/\s+/g, '');
        if (clean.startsWith('4')) return { name: 'VISA', color: 'from-blue-600 to-indigo-900', badge: 'bg-blue-600' };
        if (/^5[1-5]/.test(clean)) return { name: 'Mastercard', color: 'from-amber-600 to-red-900', badge: 'bg-orange-600' };
        if (/^3[47]/.test(clean)) return { name: 'AMEX', color: 'from-cyan-600 to-teal-900', badge: 'bg-teal-600' };
        if (/^6(?:011|5)/.test(clean)) return { name: 'Discover', color: 'from-orange-500 to-amber-800', badge: 'bg-amber-600' };
        return { name: 'Credit Card', color: 'from-zinc-900 via-neutral-900 to-zinc-800', badge: 'bg-zinc-700' };
    };

    const cardBrand = getCardBrand(cardNumber);

    // Proceed to Checkout button handler
    const handleProceedToCheckout = () => {
        openCheckout();
    };

    // Handle Pay & Purchase submission
    const handlePayAndPurchase = async (e) => {
        e.preventDefault();

        // Validate shipping details
        if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
            showToast('Please complete all required customer & shipping details.', 'error');
            return;
        }

        // Validate card details if card is selected
        if (paymentMethod === 'card') {
            if (!cardHolder.trim()) {
                showToast('Please enter the Cardholder Name.', 'error');
                return;
            }
            const cleanCardNum = cardNumber.replace(/\s+/g, '');
            if (cleanCardNum.length < 15) {
                showToast('Please enter a valid 16-digit Card Number.', 'error');
                return;
            }
            if (!cardExpiry || cardExpiry.length < 5) {
                showToast('Please enter a valid Expiry Date (MM/YY).', 'error');
                return;
            }
            if (!cardCvv || cardCvv.length < 3) {
                showToast('Please enter a valid 3 or 4-digit CVV.', 'error');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                shipping_address: address,
                shipping_city: city,
                shipping_postal: postalCode,
                shipping_notes: notes,
                shipping_method: isFreeShipping ? 'Free Standard Delivery' : shippingMethod,
                payment_method: paymentMethod,
                coupon_code: coupon ? coupon.code : null,
                items: cart.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    options: item.options,
                })),
            };

            const res = await axios.post('/api/orders/create', orderPayload);

            if (res.data.success) {
                // Trigger celebratory confetti
                try {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                } catch (err) {
                    // ignore confetti error if unsupported
                }

                const createdOrder = res.data.order;
                clearCart();
                navigate(`/order-success/${createdOrder.order_number}`);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to complete transaction. Please check your information and try again.';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-extrabold uppercase text-zinc-900 font-heading mb-2">
                    Your Shopping Bag is Empty
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-8">
                    Discover our premium car accessories and limited editions.
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-md active:scale-95"
                >
                    Explore Drops <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    const amountNeededForFreeShipping = Math.max(0, freeShippingMin - subtotal);
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingMin) * 100));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white">
            {/* Header & Steps Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            showCheckout ? 'bg-zinc-100 text-zinc-600' : 'bg-black text-white'
                        }`}>
                            1. Bag Items ({totalItemsCount})
                        </span>
                        <span className="text-zinc-300">/</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            showCheckout ? 'bg-black text-white ring-2 ring-black/20' : 'bg-zinc-100 text-zinc-400'
                        }`}>
                            2. Checkout & Payment
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-zinc-900 font-heading">
                        {showCheckout ? 'Checkout & Payment' : 'Shopping Bag'}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {showCheckout ? (
                        <button
                            type="button"
                            onClick={() => setShowCheckout(false)}
                            className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 hover:text-black flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> Edit Bag Items
                        </button>
                    ) : (
                        <Link
                            to="/shop"
                            className="text-xs font-extrabold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1.5 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Continue Shopping
                        </Link>
                    )}
                </div>
            </div>

            {/* Free Shipping Meter */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 mb-2">
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        {isFreeShipping ? (
                            <span className="text-emerald-700 font-bold">🎉 Congratulations! You unlocked FREE Worldwide Shipping!</span>
                        ) : (
                            <span>Add <strong className="text-black">{formatPrice(amountNeededForFreeShipping)}</strong> more to get Free Worldwide Shipping</span>
                        )}
                    </span>
                    <span className="font-extrabold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${isFreeShipping ? 'bg-emerald-500' : 'bg-black'}`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column (Cart Items or Compact Overview when checking out) */}
                <div className={`space-y-6 ${showCheckout ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
                    {/* Cart Items List */}
                    <div className="bg-white rounded-3xl border border-zinc-200 shadow-subtle overflow-hidden">
                        <div className="p-4 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-zinc-900" />
                                <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900">
                                    {showCheckout ? `Your Selected Items (${totalItemsCount})` : 'Cart Items'}
                                </h2>
                            </div>
                            {showCheckout && (
                                <button
                                    type="button"
                                    onClick={() => setShowCheckout(false)}
                                    className="text-[11px] font-bold text-zinc-600 hover:text-black flex items-center gap-1"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Modify
                                </button>
                            )}
                        </div>

                        <div className="divide-y divide-zinc-100 max-h-[520px] overflow-y-auto">
                            {cart.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 flex items-center gap-3.5 hover:bg-zinc-50/50 transition-colors ${
                                        showCheckout ? 'text-xs' : ''
                                    }`}
                                >
                                    {/* Thumbnail */}
                                    <Link to={`/product/${item.product.slug}`} className="w-16 h-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/60">
                                        <img
                                            src={item.product.thumbnail || item.product.gallery?.[0]}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                                            {item.product.category?.name || 'Car Accessories'}
                                        </span>
                                        <Link to={`/product/${item.product.slug}`} className="text-xs sm:text-sm font-extrabold text-zinc-900 hover:text-zinc-600 line-clamp-1">
                                            {item.product.title}
                                        </Link>

                                        <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                                            {item.options?.size && (
                                                <span className="px-1.5 py-0.5 bg-zinc-100 rounded text-black font-bold text-[10px]">
                                                    Size: {item.options.size}
                                                </span>
                                            )}
                                            {item.options?.color && (
                                                <span className="text-[10px]">Color: <strong>{item.options.color}</strong></span>
                                            )}
                                        </div>

                                        <span className="text-xs font-bold text-zinc-900 block mt-1">
                                            {formatPrice(item.product.price)} each
                                        </span>
                                    </div>

                                    {/* Stepper */}
                                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-100 text-xs"
                                        >
                                            -
                                        </button>
                                        <span className="w-7 text-center text-xs font-bold text-zinc-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-100 text-xs"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Line Total */}
                                    <div className="text-right min-w-[70px]">
                                        <span className="text-xs sm:text-sm font-extrabold text-zinc-900 font-heading">
                                            {formatPrice(Number(item.product.price) * item.quantity)}
                                        </span>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(index)}
                                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Cart footer */}
                        <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <button
                                onClick={clearCart}
                                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Clear Bag
                            </button>
                            <span className="text-[11px] text-zinc-500 font-medium">
                                Subtotal ({totalItemsCount} items): <strong className="text-black">{formatPrice(subtotal)}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Promo Code Box */}
                    <div className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-subtle space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-zinc-800" />
                            <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                                Have a Promo Code?
                            </h3>
                        </div>

                        {coupon ? (
                            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>Promo Code <strong>{coupon.code}</strong> Applied ({coupon.type === 'percentage' ? `${coupon.value}% OFF` : `-${formatPrice(coupon.value)}`})</span>
                                </div>
                                <button
                                    onClick={removeCoupon}
                                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" /> Remove
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    placeholder="e.g. WELCOME10, DROP15"
                                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <button
                                    type="submit"
                                    disabled={applyingCoupon || !couponInput.trim()}
                                    className="px-5 py-2.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                                >
                                    {applyingCoupon ? 'Applying...' : 'Apply'}
                                </button>
                            </form>
                        )}
                        <div className="text-[11px] text-zinc-400">
                            Active promo code: <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-black font-bold">WELCOME10</code> (10% off)
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-500">
                        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                                <span className="font-bold text-zinc-900 block">Encrypted & Secure</span>
                                <span>256-Bit SSL protection</span>
                            </div>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-2.5">
                            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                            <div>
                                <span className="font-bold text-zinc-900 block">Fast Tracked Delivery</span>
                                <span>Worldwide courier dispatch</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Standard Bag Summary OR Full Checkout & Payment Section) */}
                <div 
                    ref={checkoutSectionRef}
                    className={`space-y-6 ${showCheckout ? 'lg:col-span-7' : 'lg:col-span-4'}`}
                >
                    {!showCheckout ? (
                        /* Standard View Bag Summary */
                        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-subtle space-y-5 sticky top-28">
                            <h3 className="text-base font-extrabold uppercase text-zinc-900 font-heading pb-4 border-b border-zinc-100">
                                Bag Summary
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Subtotal</span>
                                    <span className="font-extrabold text-zinc-900">{formatPrice(subtotal)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-emerald-700 font-bold">
                                        <span>Discount ({coupon?.code})</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-zinc-600">
                                    <span>Shipping</span>
                                    <span>{isFreeShipping ? <strong className="text-emerald-700 font-bold uppercase">FREE</strong> : formatPrice(shippingFee)}</span>
                                </div>

                                <div className="flex justify-between text-zinc-600">
                                    <span>Estimated Tax (5%)</span>
                                    <span className="font-bold text-zinc-900">{formatPrice(taxAmount)}</span>
                                </div>

                                <div className="border-t border-zinc-200 pt-4 flex justify-between text-base font-extrabold text-zinc-900">
                                    <span>Total Amount</span>
                                    <span className="text-2xl font-heading">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleProceedToCheckout}
                                className="w-full py-4 bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="pt-2 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>100% Encrypted & Safe Checkout</span>
                            </div>
                        </div>
                    ) : (
                        /* INLINE CHECKOUT & PAYMENT SECTION ON SAME PAGE */
                        <form onSubmit={handlePayAndPurchase} className="space-y-6 animate-fade-in">
                            {/* Section 1: Customer & Delivery Information */}
                            <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 shadow-subtle space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-extrabold flex items-center justify-center">
                                            1
                                        </div>
                                        <h2 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                                            Customer & Shipping Address
                                        </h2>
                                    </div>
                                    <span className="text-[11px] text-zinc-400 font-medium">* Required</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                    <div>
                                        <label className="block font-bold text-zinc-700 mb-1">Full Name *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    if (!cardHolder) setCardHolder(e.target.value);
                                                }}
                                                placeholder="Alex Morgan"
                                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-zinc-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alex@example.com"
                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-zinc-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-zinc-700 mb-1">Street Address *</label>
                                        <input
                                            type="text"
                                            required
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="123 Innovation Way, Apt 4B"
                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-zinc-700 mb-1">City / Town *</label>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="San Francisco"
                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-zinc-700 mb-1">Postal / ZIP Code</label>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="94107"
                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium text-zinc-900 placeholder:text-zinc-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Payment & Credit/Debit Card Details */}
                            <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 shadow-subtle space-y-5">
                                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-extrabold flex items-center justify-center">
                                            2
                                        </div>
                                        <h2 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                                            Payment & Card Details
                                        </h2>
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Secure Payment
                                    </span>
                                </div>

                                {/* Payment Method Switcher */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            paymentMethod === 'card'
                                                ? 'border-black bg-zinc-900 text-white shadow-sm'
                                                : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                                        }`}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span className="font-extrabold text-[11px]">Credit/Debit</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash_on_delivery')}
                                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            paymentMethod === 'cash_on_delivery'
                                                ? 'border-black bg-zinc-900 text-white shadow-sm'
                                                : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                                        }`}
                                    >
                                        <Banknote className="w-4 h-4" />
                                        <span className="font-extrabold text-[11px]">Cash on Delivery</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('mobile_banking')}
                                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            paymentMethod === 'mobile_banking'
                                                ? 'border-black bg-zinc-900 text-white shadow-sm'
                                                : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                                        }`}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        <span className="font-extrabold text-[11px]">Mobile Wallet</span>
                                    </button>
                                </div>

                                {/* Credit / Debit Card Form */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 pt-1">
                                        {/* Visual Realistic Credit Card Mockup */}
                                        <div className={`w-full max-w-sm mx-auto p-5 rounded-2xl bg-gradient-to-tr ${cardBrand.color} text-white shadow-xl relative overflow-hidden transition-all duration-300`}>
                                            {/* Decorative shimmer circle */}
                                            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
                                            <div className="absolute -left-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />

                                            <div className="flex items-center justify-between mb-6 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-6 rounded bg-amber-400/90 flex items-center justify-center shadow-inner">
                                                        <div className="w-4 h-3 border border-amber-800/40 rounded-sm" />
                                                    </div>
                                                    <span className="text-[10px] tracking-widest font-mono text-white/70">DEBIT / CREDIT</span>
                                                </div>
                                                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-heading uppercase tracking-wider ${cardBrand.badge}`}>
                                                    {cardBrand.name}
                                                </span>
                                            </div>

                                            {/* Live Card Number */}
                                            <div className="font-mono text-base sm:text-lg tracking-widest text-white/95 mb-4 relative z-10 font-bold">
                                                {cardNumber || '•••• •••• •••• ••••'}
                                            </div>

                                            <div className="flex items-end justify-between text-xs relative z-10 pt-1 border-t border-white/15">
                                                <div>
                                                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Cardholder Name</span>
                                                    <span className="font-bold tracking-wide uppercase text-white/90 truncate max-w-[170px] block">
                                                        {cardHolder || 'CARDHOLDER NAME'}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expires</span>
                                                    <span className="font-mono font-bold text-white/90">
                                                        {cardExpiry || 'MM/YY'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Inputs */}
                                        <div className="space-y-3 text-xs">
                                            {/* Cardholder Name */}
                                            <div>
                                                <label className="block font-bold text-zinc-700 mb-1">
                                                    Cardholder Name *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={cardHolder}
                                                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                                        placeholder="ALEX MORGAN"
                                                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl uppercase font-bold focus:outline-none focus:ring-2 focus:ring-black text-zinc-900 placeholder:text-zinc-400 text-xs"
                                                    />
                                                    <User className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                                                </div>
                                            </div>

                                            {/* Card Number */}
                                            <div>
                                                <label className="block font-bold text-zinc-700 mb-1">
                                                    Card Number *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={19}
                                                        value={cardNumber}
                                                        onChange={handleCardNumberChange}
                                                        placeholder="4242 4242 4242 4242"
                                                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black text-xs placeholder:text-zinc-400"
                                                    />
                                                    <CreditCard className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                                                </div>
                                            </div>

                                            {/* Expiry & CVV */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block font-bold text-zinc-700 mb-1">
                                                        Expiry Date (MM/YY) *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            required
                                                            maxLength={5}
                                                            value={cardExpiry}
                                                            onChange={handleCardExpiryChange}
                                                            placeholder="12/28"
                                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black text-xs placeholder:text-zinc-400"
                                                        />
                                                        <Calendar className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block font-bold text-zinc-700 mb-1">
                                                        CVV / CVC *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            required
                                                            maxLength={4}
                                                            value={cardCvv}
                                                            onChange={handleCardCvvChange}
                                                            placeholder="•••"
                                                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black text-xs placeholder:text-zinc-400"
                                                        />
                                                        <Lock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'cash_on_delivery' && (
                                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 flex items-start gap-3">
                                        <Banknote className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-extrabold text-zinc-900 block mb-0.5">Cash on Delivery</span>
                                            <span>Pay conveniently with cash upon receiving your package at your doorstep. No advance card required.</span>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'mobile_banking' && (
                                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 flex items-start gap-3">
                                        <Smartphone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-extrabold text-zinc-900 block mb-0.5">Mobile Banking / Digital Wallet</span>
                                            <span>Instant payment via Apple Pay, Google Pay, or your preferred local digital mobile wallet.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Order Summary and Total Price */}
                            <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 shadow-subtle space-y-4">
                                <h3 className="text-xs font-extrabold uppercase text-zinc-900 tracking-wider pb-3 border-b border-zinc-100">
                                    Order Summary & Final Total
                                </h3>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Items Subtotal ({totalItemsCount} items)</span>
                                        <span className="font-extrabold text-zinc-900">{formatPrice(subtotal)}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-emerald-700 font-bold">
                                            <span>Coupon Discount ({coupon?.code})</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-zinc-600">
                                        <span>Shipping Delivery</span>
                                        <span>{isFreeShipping ? <strong className="text-emerald-700 font-bold uppercase">FREE</strong> : formatPrice(shippingFee)}</span>
                                    </div>

                                    <div className="flex justify-between text-zinc-600">
                                        <span>Estimated Tax (5%)</span>
                                        <span className="font-bold text-zinc-900">{formatPrice(taxAmount)}</span>
                                    </div>

                                    <div className="border-t border-zinc-200 pt-3.5 flex justify-between text-base font-extrabold text-zinc-900">
                                        <div>
                                            <span className="block text-sm">Total Price</span>
                                            <span className="text-[10px] text-zinc-400 font-normal">All taxes and fees included</span>
                                        </div>
                                        <span className="text-2xl font-heading text-black">{formatPrice(grandTotal)}</span>
                                    </div>
                                </div>

                                {/* Pay & Purchase Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 active:scale-[0.99] text-white font-extrabold rounded-2xl text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Processing Payment...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4 text-emerald-400" />
                                                <span>Pay & Purchase • {formatPrice(grandTotal)}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Encrypted 256-Bit SSL Checkout • 100% Satisfaction Guarantee</span>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
