<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CartCheckoutController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// PUBLIC STOREFRONT ENDPOINTS
// ==========================================
Route::get('/home', [StoreController::class, 'getHome']);
Route::get('/products', [StoreController::class, 'getProducts']);
Route::get('/products/{slug}', [StoreController::class, 'getProductBySlug']);
Route::get('/categories', [StoreController::class, 'getCategories']);
Route::get('/brands', [StoreController::class, 'getBrands']);
Route::get('/settings', [StoreController::class, 'getSettings']);
Route::get('/benefits', [StoreController::class, 'getBenefits']);
Route::get('/faqs', [StoreController::class, 'getFaqs']);
Route::post('/newsletter', [StoreController::class, 'subscribeNewsletter']);
Route::post('/products/{productId}/reviews', [StoreController::class, 'submitReview']);

// Cart & Checkout
Route::post('/coupon/apply', [CartCheckoutController::class, 'applyCoupon']);
Route::post('/orders/create', [CartCheckoutController::class, 'createOrder']);
Route::post('/orders/track', [CartCheckoutController::class, 'trackOrder']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// ==========================================
// ADMIN CMS ENDPOINTS
// ==========================================
// Allow direct admin requests (or sanctum authenticated)
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'getDashboard']);

    // Products
    Route::get('/products', [AdminController::class, 'getProducts']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

    // Categories
    Route::get('/categories', [AdminController::class, 'getCategories']);
    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

    // Brands
    Route::get('/brands', [AdminController::class, 'getBrands']);
    Route::post('/brands', [AdminController::class, 'storeBrand']);
    Route::put('/brands/{id}', [AdminController::class, 'updateBrand']);
    Route::delete('/brands/{id}', [AdminController::class, 'deleteBrand']);

    // Orders
    Route::get('/orders', [AdminController::class, 'getOrders']);
    Route::get('/orders/{id}', [AdminController::class, 'showOrder']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);

    // Customers
    Route::get('/customers', [AdminController::class, 'getCustomers']);
    Route::post('/customers/{id}/toggle-status', [AdminController::class, 'toggleCustomerStatus']);

    // Banners
    Route::get('/banners', [AdminController::class, 'getBanners']);
    Route::post('/banners', [AdminController::class, 'storeBanner']);
    Route::put('/banners/{id}', [AdminController::class, 'updateBanner']);
    Route::delete('/banners/{id}', [AdminController::class, 'deleteBanner']);

    // Coupons
    Route::get('/coupons', [AdminController::class, 'getCoupons']);
    Route::post('/coupons', [AdminController::class, 'storeCoupon']);
    Route::put('/coupons/{id}', [AdminController::class, 'updateCoupon']);
    Route::delete('/coupons/{id}', [AdminController::class, 'deleteCoupon']);

    // Reviews
    Route::get('/reviews', [AdminController::class, 'getReviews']);
    Route::post('/reviews/{id}/toggle-approval', [AdminController::class, 'toggleReviewApproval']);
    Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview']);

    // Benefits
    Route::get('/benefits', [AdminController::class, 'getBenefits']);
    Route::post('/benefits', [AdminController::class, 'storeBenefit']);
    Route::put('/benefits/{id}', [AdminController::class, 'updateBenefit']);
    Route::delete('/benefits/{id}', [AdminController::class, 'deleteBenefit']);

    // FAQs
    Route::get('/faqs', [AdminController::class, 'getFaqs']);
    Route::post('/faqs', [AdminController::class, 'storeFaq']);
    Route::put('/faqs/{id}', [AdminController::class, 'updateFaq']);
    Route::delete('/faqs/{id}', [AdminController::class, 'deleteFaq']);

    // Newsletters
    Route::get('/newsletters', [AdminController::class, 'getNewsletters']);

    // Settings
    Route::get('/settings', [AdminController::class, 'getSettings']);
    Route::post('/settings', [AdminController::class, 'updateSettings']);
});
