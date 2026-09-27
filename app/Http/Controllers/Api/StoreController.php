<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Banner;
use App\Models\Setting;
use App\Models\Review;
use App\Models\Benefit;
use App\Models\Faq;
use App\Models\Newsletter;

class StoreController extends Controller
{
    /**
     * Get data for homepage
     */
    public function getHome()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
            ->orderBy('sort_order', 'asc')
            ->get();

        $featuredProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with(['category', 'brand'])
            ->take(8)
            ->get();

        $trendingProducts = Product::where('is_active', true)
            ->where('is_trending', true)
            ->with(['category', 'brand'])
            ->take(8)
            ->get();

        $newArrivals = Product::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->with(['category', 'brand'])
            ->take(8)
            ->get();

        $flashDeals = Product::where('is_active', true)
            ->whereNotNull('compare_price')
            ->whereColumn('compare_price', '>', 'price')
            ->with(['category', 'brand'])
            ->take(6)
            ->get();

        $brands = Brand::where('is_active', true)->get();

        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'banners' => $banners,
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'trendingProducts' => $trendingProducts,
            'newArrivals' => $newArrivals,
            'flashDeals' => $flashDeals,
            'brands' => $brands,
            'settings' => $settings,
        ]);
    }

    /**
     * Get products catalog with search, filter, and sort
     */
    public function getProducts(Request $request)
    {
        $query = Product::where('is_active', true)->with(['category', 'brand']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $catSlug = $request->category;
            $category = Category::where('slug', $catSlug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Brand filter
        if ($request->filled('brand')) {
            $brandSlug = $request->brand;
            $brand = Brand::where('slug', $brandSlug)->first();
            if ($brand) {
                $query->where('brand_id', $brand->id);
            }
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float)$request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float)$request->max_price);
        }

        // In Stock filter
        if ($request->boolean('in_stock')) {
            $query->where('stock_quantity', '>', 0);
        }

        // Sorting
        $sort = $request->get('sort', 'featured');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')->orderBy('id', 'desc');
                break;
        }

        $perPage = (int)$request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get single product detail by slug
     */
    public function getProductBySlug($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category', 'brand', 'reviews'])
            ->firstOrFail();

        $relatedProducts = Product::where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return response()->json([
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Get all active categories
     */
    public function getCategories()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json($categories);
    }

    /**
     * Get all active brands
     */
    public function getBrands()
    {
        $brands = Brand::where('is_active', true)->get();
        return response()->json($brands);
    }

    /**
     * Get public store settings
     */
    public function getSettings()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Submit a customer review
     */
    public function submitReview(Request $request, $productId)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'nullable|email|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:150',
            'comment' => 'required|string|max:1000',
        ]);

        $product = Product::findOrFail($productId);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => auth('sanctum')->id(),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_approved' => true, // auto approve or moderate
            'is_verified_purchase' => true,
        ]);

        // Recalculate product rating
        $avgRating = Review::where('product_id', $product->id)->where('is_approved', true)->avg('rating');
        $count = Review::where('product_id', $product->id)->where('is_approved', true)->count();
        $product->update([
            'rating' => round($avgRating, 2),
            'review_count' => $count,
        ]);

        return response()->json([
            'message' => 'Thank you! Your review has been published.',
            'review' => $review,
        ]);
    }

    public function getBenefits()
    {
        $benefits = Benefit::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->get();
            
        return response()->json($benefits);
    }

    public function getFaqs()
    {
        $faqs = Faq::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->get();
            
        return response()->json($faqs);
    }

    public function subscribeNewsletter(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $subscriber = Newsletter::firstOrCreate(
            ['email' => $request->email],
            ['is_subscribed' => true]
        );

        if (!$subscriber->wasRecentlyCreated && !$subscriber->is_subscribed) {
            $subscriber->update(['is_subscribed' => true]);
        }

        return response()->json(['message' => 'Successfully subscribed to newsletter']);
    }
}
