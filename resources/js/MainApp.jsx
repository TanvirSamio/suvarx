import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Context Providers
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';

// Storefront Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderTracking } from './pages/OrderTracking';
import { CustomerAccount } from './pages/CustomerAccount';

// Admin CMS Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminBrands } from './admin/AdminBrands';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminBanners } from './admin/AdminBanners';
import { AdminCoupons } from './admin/AdminCoupons';
import { AdminReviews } from './admin/AdminReviews';
import { AdminSettings } from './admin/AdminSettings';
import { AdminBenefits } from './admin/AdminBenefits';
import { AdminFaq } from './admin/AdminFaq';

// Public Storefront Layout Wrapper
const StorefrontLayout = () => {
    const { isDark } = useTheme();

    return (
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-[#0A0A0C] text-white' : 'bg-[#FAFAFA] text-[#111111]'
        }`}>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
            <AuthModal />
            <Toast />
        </div>
    );
};

export const MainApp = () => {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Router>
                                <Routes>
                                    {/* Admin CMS Routes */}
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="products" element={<AdminProducts />} />
                                        <Route path="categories" element={<AdminCategories />} />
                                        <Route path="brands" element={<AdminBrands />} />
                                        <Route path="benefits" element={<AdminBenefits />} />
                                        <Route path="faqs" element={<AdminFaq />} />
                                        <Route path="orders" element={<AdminOrders />} />
                                        <Route path="customers" element={<AdminCustomers />} />
                                        <Route path="banners" element={<AdminBanners />} />
                                        <Route path="coupons" element={<AdminCoupons />} />
                                        <Route path="reviews" element={<AdminReviews />} />
                                        <Route path="settings" element={<AdminSettings />} />
                                    </Route>

                                    {/* Public Storefront Routes */}
                                    <Route element={<StorefrontLayout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/shop" element={<Shop />} />
                                        <Route path="/product/:slug" element={<ProductDetail />} />
                                        <Route path="/cart" element={<CartPage />} />
                                        <Route path="/checkout" element={<CheckoutPage />} />
                                        <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
                                        <Route path="/track-order" element={<OrderTracking />} />
                                        <Route path="/account" element={<CustomerAccount />} />
                                        {/* Fallback */}
                                        <Route path="*" element={<Home />} />
                                    </Route>
                                </Routes>
                            </Router>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
};
