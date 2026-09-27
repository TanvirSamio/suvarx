import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { 
    Filter, 
    SlidersHorizontal, 
    X, 
    Search, 
    ArrowUpDown, 
    Sparkles, 
    RotateCcw 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Shop = () => {
    const { formatPrice } = useSettings();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState(searchParams.get('max_price') || '5000');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const sizes = ['S', 'M', 'L', 'XL', '2XL'];

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/brands'),
                ]);
                setCategories(catRes.data || []);
                setBrands(brandRes.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `/api/products?sort=${sortBy}`;
            if (selectedCategory) url += `&category=${selectedCategory}`;
            if (selectedBrand) url += `&brand=${selectedBrand}`;
            if (priceRange) url += `&max_price=${priceRange}`;
            if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
            if (inStockOnly) url += `&in_stock=1`;

            const res = await axios.get(url);
            setProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedBrand, priceRange, sortBy, search, inStockOnly]);

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setSelectedSize('');
        setPriceRange('100');
        setSearch('');
        setInStockOnly(false);
        setSortBy('featured');
    };

    return (
        <div className="bg-[#070709] min-h-screen text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Catalog Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                        <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-pink-400">
                            CAR ACCESSORIES COLLECTION
                        </span>
                        <h1 className="ciao-title text-3xl sm:text-5xl text-white tracking-tight">
                            ALL PRODUCTS
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileFilterOpen(true)}
                            className="lg:hidden px-4 py-2.5 bg-white/10 text-white rounded-full text-xs font-mono font-extrabold flex items-center gap-2 border border-white/15"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                        </button>

                        <div className="flex items-center gap-2 bg-[#111116] border border-white/15 px-3.5 py-2 rounded-full text-xs font-bold font-mono">
                            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="featured" className="bg-[#111116] text-white">Featured Drops</option>
                                <option value="newest" className="bg-[#111116] text-white">Newest Releases</option>
                                <option value="price_low" className="bg-[#111116] text-white">Price: Low to High</option>
                                <option value="price_high" className="bg-[#111116] text-white">Price: High to Low</option>
                                <option value="rating" className="bg-[#111116] text-white">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout (Sidebar + Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Desktop Sidebar (3 cols) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#101015] p-6 rounded-3xl border border-white/10">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-400">
                                Search Drops
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Keywords..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-2xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </div>
                        </div>

                        {/* Collections */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-400">
                                Collections
                            </label>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('')}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                        selectedCategory === '' ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>All Drops</span>
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            selectedCategory === cat.slug ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-[10px] opacity-60 font-mono">({cat.products_count || 0})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-400">
                                Size
                            </label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {sizes.map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                                        className={`py-2 rounded-xl text-xs font-mono font-extrabold border transition-colors ${
                                            selectedSize === sz
                                                ? 'bg-white text-black border-white'
                                                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400">
                                <span>Max Price</span>
                                <span className="text-white font-bold">{formatPrice(priceRange)}</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="5000"
                                step="50"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full accent-pink-500 cursor-pointer"
                            />
                        </div>

                        {/* Clear Filters */}
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 font-mono font-extrabold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filters</span>
                        </button>
                    </aside>

                    {/* Products Grid (9 cols) */}
                    <main className="lg:col-span-9 space-y-6">
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-[#111116] rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4 bg-[#101015] rounded-3xl border border-white/10 p-8">
                                <h3 className="ciao-title text-xl text-white">
                                    NO DROPS FOUND
                                </h3>
                                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
                                    Try resetting filters or searching for different keywords.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="px-6 py-2.5 bg-white text-black font-extrabold text-xs rounded-full uppercase font-mono"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
