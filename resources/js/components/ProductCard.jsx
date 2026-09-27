import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';

export const ProductCard = ({ product }) => {
    const { addToCart, openQuickView } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { formatPrice } = useSettings();

    const [selectedSize, setSelectedSize] = useState(
        product?.attributes?.sizes ? product.attributes.sizes[0] : 'L'
    );
    const [selectedColor, setSelectedColor] = useState(
        product?.attributes?.colors ? product.attributes.colors[0] : null
    );

    if (!product) return null;

    const discountPercent = product.compare_price && product.compare_price > product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : null;

    const isWish = isInWishlist(product.id);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, {
            size: selectedSize,
            color: selectedColor,
        });
    };

    return (
        <div className="group relative bg-[#101015] rounded-3xl border border-white/10 hover:border-white/40 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-card">
            {/* Image & Badges Container */}
            <div className="relative aspect-[4/5] bg-black/40 overflow-hidden">
                <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.thumbnail || (product.gallery && product.gallery[0])}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                    />
                </Link>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">

                    {discountPercent && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-pink-600 text-white">
                            -{discountPercent}% OFF
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isWish
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-black/60 hover:bg-black text-white/80 backdrop-blur-md border border-white/20'
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-white' : ''}`} />
                </button>

                {/* Quick Action Overlay (Hover) */}
                <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openQuickView(product);
                        }}
                        className="flex-1 py-2.5 bg-white/90 hover:bg-white text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl backdrop-blur-md shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[11px] uppercase rounded-xl shadow-md flex items-center justify-center transition-all"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Meta & Info */}
            <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="uppercase tracking-wider truncate max-w-[140px]">
                        {product.category?.name || 'Car Accessories'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating || '4.95'}</span>
                    </div>
                </div>

                <Link to={`/product/${product.slug}`} className="block">
                    <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 group-hover:text-pink-400 transition-colors uppercase">
                        {product.title}
                    </h3>
                </Link>

                {/* Sizes Pills */}
                {product.attributes?.sizes && (
                    <div className="flex items-center gap-1.5 pt-1">
                        {product.attributes.sizes.slice(0, 5).map((sz) => (
                            <button
                                key={sz}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedSize(sz);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                                    selectedSize === sz
                                        ? 'bg-white text-black border-white'
                                        : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                )}

                {/* Price */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-white font-heading">
                            {formatPrice(product.price)}
                        </span>
                        {product.compare_price && (
                            <span className="text-xs text-zinc-500 line-through">
                                {formatPrice(product.compare_price)}
                            </span>
                        )}
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase ${
                        product.stock_quantity <= product.low_stock_threshold ? 'text-pink-400' : 'text-emerald-400'
                    }`}>
                        {product.stock_quantity <= product.low_stock_threshold ? 'Low Stock' : 'In Stock'}
                    </span>
                </div>
            </div>
        </div>
    );
};
