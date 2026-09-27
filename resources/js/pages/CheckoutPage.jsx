import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CheckoutPage = () => {
    const { openCheckout } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        openCheckout();
        navigate('/', { replace: true });
    }, [openCheckout, navigate]);

    return null;
};
