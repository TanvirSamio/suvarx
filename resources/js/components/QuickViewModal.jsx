import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { X, Star, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export const QuickViewModal = () => {
    const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart } = useCart();
    const { formatPrice } = useSettings();

    const [selectedSize, setSelectedSize] = useState('L');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (quickViewProduct?.attributes?.sizes?.length) {
            setSelectedSize(quickViewProduct.attributes.sizes[0]);
        }
        if (quickViewProduct?.attributes?.colors?.length) {
            setSelectedColor(quickViewProduct.attributes.colors[0]);
        }
        setQuantity(1);
    }, [quickViewProduct]);

    if (!isQuickViewOpen || !quickViewProduct) return null;

    const handleAddToCart = () => {
        addToCart(quickViewProduct, quantity, {
            size: selectedSize,
            color: selectedColor,
        });
        closeQuickView();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-zinc-100 grid grid-cols-1 md:grid-cols-2 relative">
                {/* Close Button */}
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center shadow-md"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left: Image */}
                <div className="aspect-[4/5] bg-zinc-100 overflow-hidden relative">
                    <img
                        src={quickViewProduct.thumbnail || (quickViewProduct.gallery && quickViewProduct.gallery[0])}
                        alt={quickViewProduct.title}
                        className="w-full h-full object-cover"
                    />

                </div>

                {/* Right: Details & Pickers */}
                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">
                            {quickViewProduct.category?.name || 'Car Accessories'}
                        </span>

                        <h3 className="font-heading font-extrabold text-lg uppercase text-zinc-900 leading-snug">
                            {quickViewProduct.title}
                        </h3>

                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-zinc-900 font-heading">
                                {formatPrice(quickViewProduct.price)}
                            </span>
                            {quickViewProduct.compare_price && (
                                <span className="text-xs text-zinc-400 line-through">
                                    {formatPrice(quickViewProduct.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Size Picker */}
                        {quickViewProduct.attributes?.sizes && (
                            <div className="space-y-1.5 pt-1">
                                <label className="text-[11px] font-extrabold uppercase text-zinc-700">
                                    Size: <strong>{selectedSize}</strong>
                                </label>
                                <div className="flex gap-1.5">
                                    {quickViewProduct.attributes.sizes.map((sz) => (
                                        <button
                                            key={sz}
                                            type="button"
                                            onClick={() => setSelectedSize(sz)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                selectedSize === sz
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                                            }`}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add to Bag CTA */}
                    <div className="space-y-2 pt-4 border-t border-zinc-100">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs rounded-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Bag</span>
                        </button>

                        <Link
                            to={`/product/${quickViewProduct.slug}`}
                            onClick={closeQuickView}
                            className="w-full py-2.5 text-center text-xs font-extrabold text-zinc-600 hover:text-black uppercase tracking-wider block"
                        >
                            View Full Details →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
