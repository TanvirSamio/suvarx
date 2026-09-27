import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { settings } = useSettings();
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('m3s_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [coupon, setCoupon] = useState(() => {
        const saved = localStorage.getItem('m3s_coupon');
        return saved ? JSON.parse(saved) : null;
    });
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        localStorage.setItem('m3s_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (coupon) {
            localStorage.setItem('m3s_coupon', JSON.stringify(coupon));
        } else {
            localStorage.removeItem('m3s_coupon');
        }
    }, [coupon]);

    const showToast = (message, type = 'success') => {
        setToastMessage({ message, type, id: Date.now() });
        setTimeout(() => {
            setToastMessage(null);
        }, 3500);
    };

    const addToCart = (product, quantity = 1, options = null, openDrawer = true) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => 
                item.product.id === product.id && 
                JSON.stringify(item.options) === JSON.stringify(options)
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                const newQty = updated[existingIndex].quantity + quantity;
                // Stock limit check
                if (product.stock_quantity && newQty > product.stock_quantity) {
                    showToast(`Only ${product.stock_quantity} items available in stock`, 'error');
                    return prev;
                }
                updated[existingIndex].quantity = newQty;
                return updated;
            } else {
                if (product.stock_quantity && quantity > product.stock_quantity) {
                    showToast(`Only ${product.stock_quantity} items available in stock`, 'error');
                    return prev;
                }
                return [...prev, { product, quantity, options }];
            }
        });

        showToast(`Added "${product.title}" to your cart!`, 'success');
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };

    const openCheckout = (product = null, quantity = 1, options = null) => {
        if (product) {
            setCart(prev => {
                const existingIndex = prev.findIndex(item => 
                    item.product.id === product.id && 
                    JSON.stringify(item.options) === JSON.stringify(options)
                );
                if (existingIndex > -1) {
                    const updated = [...prev];
                    updated[existingIndex].quantity = quantity;
                    return updated;
                }
                return [...prev, { product, quantity, options }];
            });
        }
        setIsCheckoutOpen(true);
        setIsCartOpen(true);
    };

    const updateQuantity = (index, quantity) => {
        if (quantity <= 0) {
            removeFromCart(index);
            return;
        }
        setCart(prev => {
            const updated = [...prev];
            const item = updated[index];
            if (item && item.product.stock_quantity && quantity > item.product.stock_quantity) {
                showToast(`Maximum ${item.product.stock_quantity} items allowed in stock`, 'error');
                return prev;
            }
            if (updated[index]) {
                updated[index].quantity = quantity;
            }
            return updated;
        });
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
        showToast('Item removed from cart', 'info');
    };

    const clearCart = () => {
        setCart([]);
        setCoupon(null);
        localStorage.removeItem('m3s_cart');
        localStorage.removeItem('m3s_coupon');
    };

    // Calculate Subtotal
    const subtotal = cart.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Apply Coupon
    const applyCouponCode = async (code) => {
        if (!code || !code.trim()) {
            showToast('Please enter a coupon code', 'error');
            return false;
        }

        try {
            const res = await axios.post('/api/coupon/apply', {
                code: code.trim(),
                subtotal: subtotal,
            });

            if (res.data.success) {
                setCoupon(res.data.coupon);
                showToast(res.data.message, 'success');
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid or expired coupon code';
            showToast(msg, 'error');
            return false;
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        showToast('Coupon removed', 'info');
    };

    // Calculate Discount Amount
    let discountAmount = 0;
    if (coupon) {
        if (coupon.type === 'percentage') {
            discountAmount = (subtotal * Number(coupon.value)) / 100;
        } else {
            discountAmount = Number(coupon.value);
        }
        discountAmount = Math.min(discountAmount, subtotal);
    }

    // Shipping calculations
    const freeShippingMin = Number(settings.free_shipping_min) || 99;
    const standardShippingFee = Number(settings.shipping_standard_fee) || 9.99;
    const isFreeShipping = subtotal >= freeShippingMin && subtotal > 0;
    const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : standardShippingFee);

    // Tax calculation
    const taxRate = Number(settings.tax_rate_percent) || 5;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = cart.length === 0 ? 0 : roundToTwo((taxableAmount * taxRate) / 100);

    // Grand total
    const grandTotal = cart.length === 0 ? 0 : roundToTwo(taxableAmount + shippingFee + taxAmount);

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    const openQuickView = (product) => setQuickViewProduct(product);
    const closeQuickView = () => setQuickViewProduct(null);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            subtotal,
            totalItemsCount,
            isCartOpen,
            setIsCartOpen,
            isCheckoutOpen,
            setIsCheckoutOpen,
            openCheckout,
            coupon,
            applyCouponCode,
            removeCoupon,
            discountAmount,
            shippingFee,
            isFreeShipping,
            freeShippingMin,
            taxAmount,
            grandTotal,
            quickViewProduct,
            openQuickView,
            closeQuickView,
            toastMessage,
            showToast,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
