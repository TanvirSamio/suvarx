import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        store_name: 'SUVARX',
        store_tagline: 'Premium Auto & Lifestyle Gadgets',
        store_email: 'orders@suvarx.com',
        store_phone: '+880 1700-000000',
        store_address: 'Dhaka, Bangladesh',
        currency_symbol: '৳',
        currency_code: 'BDT',
        shipping_standard_fee: '60.00',
        shipping_express_fee: '120.00',
        free_shipping_min: '1500.00',
        tax_rate_percent: '0.00',
        announcement_bar: '🔥 SPECIAL LAUNCH: Get 10% OFF with code WELCOME10 | Free delivery all over Bangladesh',
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings');
            if (res.data) {
                setSettings(prev => ({ ...prev, ...res.data }));
            }
        } catch (error) {
            console.error('Failed to load store settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const [activeCurrency, setActiveCurrency] = useState('BDT');

    const exchangeRates = {
        BDT: { rate: 1, symbol: '৳' },
        USD: { rate: 0.0083, symbol: '$' },
        GBP: { rate: 0.0067, symbol: '£' }
    };

    const toggleCurrency = (curr) => {
        if(exchangeRates[curr]) setActiveCurrency(curr);
    };

    const formatPrice = (amount) => {
        const num = Number(amount) || 0;
        const current = exchangeRates[activeCurrency] || exchangeRates.BDT;
        const rate = current.rate;
        const converted = num * rate;
        const sym = current.symbol;
        return `${sym}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    return (
        <SettingsContext.Provider value={{ settings, formatPrice, fetchSettings, loading, activeCurrency, toggleCurrency }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
