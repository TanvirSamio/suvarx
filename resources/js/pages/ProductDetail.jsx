import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { 
    Star, 
    Truck, 
    ShieldCheck, 
    RotateCcw, 
    Heart, 
    ShoppingBag, 
    Sparkles, 
    Check, 
    ChevronRight,
    ShieldCheck as CarIcon,
} from 'lucide-react';

const ModelViewer = ({ url, scale, posX, posY, posZ, rotX, rotY, rotZ }) => {
    const { scene } = useGLTF(url);
    // Apply a 1.5x multiplier for the detail view since it should be larger here
    const detailScale = (scale ?? 2.0) * 1.5;
    return (
        <primitive 
            object={scene} 
            scale={detailScale} 
            position={[posX ?? 0, (posY ?? -1) - 0.5, posZ ?? 0]} 
            rotation={[rotX ?? 0, rotY ?? 0, rotZ ?? 0]} 
        />
    );
};

const getProductBackground = (prod) => {
    if (!prod) return {};
    if (prod.bg_type === 'image' && prod.bg_image) {
        return {
            backgroundImage: `url("${prod.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }
    if (prod.bg_type === 'gradient' && prod.bg_gradient) {
        return {
            background: prod.bg_gradient,
        };
    }
    if (prod.bg_type === 'color' && prod.bg_color) {
        return {
            backgroundColor: prod.bg_color,
        };
    }
    if (prod.bg_gradient && prod.bg_type !== 'image') {
        return { background: prod.bg_gradient };
    }
    if (prod.bg_image && prod.bg_type !== 'gradient') {
        return {
            backgroundImage: `url("${prod.bg_image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    }
    return {};
};

export const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useSettings();
    const { addToCart, showToast, openCheckout } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        customer_name: '',
        customer_email: '',
        rating: 5,
        title: '',
        comment: '',
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/products/${slug}`);
                const data = res.data.product;
                setProduct(data);
                setRelatedProducts(res.data.related || []);
                setActiveImage(data.thumbnail || (data.gallery && data.gallery[0]) || '');

                if (data.attributes?.colors?.length) {
                    setSelectedColor(data.attributes.colors[0]);
                }

                const revRes = await axios.get(`/api/products/${data.id}/reviews`);
                setReviews(revRes.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
            window.scrollTo(0, 0);
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070709] text-zinc-400">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#070709] text-white">
                <h2 className="ciao-title text-2xl mb-4">Drop Not Found</h2>
                <Link to="/shop" className="px-6 py-3 bg-white text-black text-xs font-mono font-bold rounded-full uppercase">
                    Return to Drops
                </Link>
            </div>
        );
    }

    const isWish = isInWishlist(product.id);
    const discountPercent = product.compare_price && product.compare_price > product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : null;

    const handleAddToCart = () => {
        addToCart(product, quantity, {
            color: selectedColor,
        });
    };

    const handleBuyNow = () => {
        openCheckout(product, quantity, {
            color: selectedColor,
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await axios.post(`/api/products/${product.id}/reviews`, reviewForm);
            showToast('Verified review submitted!', 'success');
            setReviewForm({
                customer_name: '',
                customer_email: '',
                rating: 5,
                title: '',
                comment: '',
            });
            const revRes = await axios.get(`/api/products/${product.id}/reviews`);
            setReviews(revRes.data.data || []);
        } catch (err) {
            showToast('Failed to submit review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="bg-[#070709] min-h-screen text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider">
                    <Link to="/" className="hover:text-white">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to="/shop" className="hover:text-white">Drops</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-white font-bold truncate max-w-[200px]">{product.title}</span>
                </div>

                {/* 2-Column Product Stage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    {/* Left: Gallery (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div 
                            className="relative aspect-[4/5] bg-[#111116] rounded-3xl overflow-hidden shadow-2xl border border-white/15 group transition-all duration-500"
                            style={getProductBackground(product)}
                        >
                            {product.model_3d ? (
                                <div className="absolute inset-0 z-10 cursor-move">
                                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                                        <ambientLight intensity={0.5} />
                                        <spotLight position={[0, 5, -5]} angle={0.6} penumbra={1} intensity={2} color="#FF1F7D" />
                                        <React.Suspense fallback={null}>
                                            <ModelViewer 
                                                url={product.model_3d}
                                                scale={product.model_scale}
                                                posX={product.model_pos_x}
                                                posY={product.model_pos_y}
                                                posZ={product.model_pos_z}
                                                rotX={product.model_rot_x}
                                                rotY={product.model_rot_y}
                                                rotZ={product.model_rot_z}
                                            />
                                            <Environment preset="city" />
                                        </React.Suspense>
                                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                                    </Canvas>
                                    <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
                                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                            Interact to Rotate 3D Model
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={activeImage}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            {discountPercent && (
                                <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-pink-600 text-white shadow-lg">
                                    -{discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {product.gallery && product.gallery.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {product.gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-20 h-24 rounded-2xl bg-[#111116] overflow-hidden border-2 shrink-0 transition-all ${
                                            activeImage === img ? 'border-white scale-95' : 'border-white/10 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Controls (5 cols) */}
                    <div className="lg:col-span-5 space-y-6 bg-[#101015] p-6 sm:p-8 rounded-3xl border border-white/10">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="uppercase text-pink-400 font-bold">
                                    {product.category?.name || 'Car Accessories'}
                                </span>
                                <div className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    <span>{product.rating || '4.95'}</span>
                                    <span className="text-zinc-500">({product.review_count || 38})</span>
                                </div>
                            </div>

                            <h1 className="ciao-title text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 pb-4 border-b border-white/10">
                            <span className="ciao-title text-3xl text-white">
                                {formatPrice(product.price)}
                            </span>
                            {product.compare_price && (
                                <span className="text-lg text-zinc-500 line-through font-mono">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                            <span className="ml-auto text-[10px] font-mono font-bold uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                In Stock ({product.stock_quantity})
                            </span>
                        </div>

                        {/* Car Accessories Quality Callout */}
                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1 text-xs">
                            <div className="flex items-center gap-2 font-mono font-bold text-white uppercase">
                                <Sparkles className="w-4 h-4 text-pink-400" />
                                <span>Premium Quality Guarantee</span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                                Precision-engineered for your vehicle. Universal fit, durable build, and hassle-free installation.
                            </p>
                        </div>

                        {/* Quantity & CTA */}
                        <div className="space-y-3 pt-2">
                            <div className="flex gap-3">
                                <div className="flex items-center border border-white/15 rounded-2xl bg-black/40 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center font-bold text-zinc-400"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-mono font-bold text-xs text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center font-bold text-zinc-400"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs rounded-2xl uppercase tracking-wider shadow-glow-white flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add to Bag</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                                        isWish
                                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs rounded-2xl uppercase tracking-wider transition-all shadow-lg active:scale-95"
                            >
                                Instant 1-Click Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};
