import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { 
    User, 
    ShoppingBag, 
    Heart, 
    LogOut, 
    Edit2, 
    Save, 
    Clock, 
    ChevronRight, 
    Truck, 
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

export const CustomerAccount = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, token, logout, openAuthModal, setUser } = useAuth();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { formatPrice } = useSettings();
    const { showToast } = useCart();
    const navigate = useNavigate();

    const activeTab = searchParams.get('tab') || 'orders'; // 'orders', 'wishlist', 'profile'

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Profile form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [password, setPassword] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        if (!user && !token) {
            openAuthModal('login');
        }
    }, [user, token]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setCity(user.city || '');
            setPostalCode(user.postal_code || '');
        }
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await axios.get('/api/auth/profile');
                setOrders(res.data.orders || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (token && activeTab === 'orders') {
            fetchOrders();
        }
    }, [token, activeTab]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const payload = { name, phone, address, city, postal_code: postalCode };
            if (password) payload.password = password;

            const res = await axios.put('/api/auth/profile', payload);
            setUser(res.data.user);
            localStorage.setItem('m3s_user', JSON.stringify(res.data.user));
            showToast('Profile updated successfully!', 'success');
            setPassword('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Please Sign In</h2>
                <p className="text-xs text-slate-500">Sign in to your account to manage orders, wishlist and address.</p>
                <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header / Profile Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
                        <p className="text-xs text-slate-500">{user.email} • {user.phone || 'No phone set'}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                            {user.role} Member
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition-colors"
                        >
                            Open Admin CMS
                        </Link>
                    )}
                    <button
                        onClick={logout}
                        className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-subtle max-w-md">
                <button
                    onClick={() => setSearchParams({ tab: 'orders' })}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4" /> My Orders ({orders.length})
                </button>
                <button
                    onClick={() => setSearchParams({ tab: 'wishlist' })}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
                </button>
                <button
                    onClick={() => setSearchParams({ tab: 'profile' })}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'profile' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <User className="w-4 h-4" /> Edit Profile
                </button>
            </div>

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
                    <h3 className="text-base font-extrabold text-slate-900">
                        Order History
                    </h3>

                    {loading ? (
                        <div className="p-8 text-center text-xs text-slate-500">Loading orders...</div>
                    ) : orders.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {orders.map(o => (
                                <div key={o.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-slate-900 text-sm">{o.order_number}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                o.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                o.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                o.order_status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>
                                                {o.order_status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Placed on {new Date(o.created_at).toLocaleDateString()} • {o.items?.length || 0} Products
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-base font-extrabold text-slate-900">
                                            {formatPrice(o.total_amount)}
                                        </span>
                                        <Link
                                            to={`/order-success/${o.order_number}`}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                                        >
                                            View Receipt
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 mb-4">You haven't placed any orders yet.</p>
                            <Link to="/shop" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
                                Browse Store
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === 'wishlist' && (
                <div className="space-y-6">
                    <h3 className="text-base font-extrabold text-slate-900">
                        Saved Wishlist Items ({wishlist.length})
                    </h3>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {wishlist.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-subtle">
                            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 mb-4">Your wishlist is currently empty.</p>
                            <Link to="/shop" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
                                Find Products to Save
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: PROFILE FORM */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle max-w-2xl">
                    <h3 className="text-base font-extrabold text-slate-900 mb-6">
                        Edit Account Details
                    </h3>

                    <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block font-bold text-slate-700 mb-1">New Password (Leave blank to keep current)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            {isSavingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
