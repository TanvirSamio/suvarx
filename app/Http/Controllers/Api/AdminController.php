<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Order;
use App\Models\User;
use App\Models\Banner;
use App\Models\Coupon;
use App\Models\Setting;
use App\Models\Benefit;
use App\Models\Faq;
use App\Models\Newsletter;

class AdminController extends Controller
{
    /**
     * Dashboard Overview Statistics & Charts
     */
    public function getDashboard()
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'customer')->count();

        // Low stock products alert
        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->orderBy('stock_quantity', 'asc')
            ->take(6)
            ->get();

        // Recent 8 orders
        $recentOrders = Order::with('items')->latest()->take(8)->get();

        // Monthly revenue trend (last 6 months)
        $monthlySales = Order::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, SUM(total_amount) as total, COUNT(*) as orders")
            ->groupBy('month')
            ->orderByRaw("MIN(created_at) ASC")
            ->take(6)
            ->get();

        // Orders breakdown by status
        $ordersByStatus = [
            'pending' => Order::where('order_status', 'pending')->count(),
            'processing' => Order::where('order_status', 'processing')->count(),
            'shipped' => Order::where('order_status', 'shipped')->count(),
            'delivered' => Order::where('order_status', 'delivered')->count(),
            'cancelled' => Order::where('order_status', 'cancelled')->count(),
        ];

        return response()->json([
            'stats' => [
                'totalRevenue' => (float)$totalRevenue,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'monthlySales' => $monthlySales,
            'ordersByStatus' => $ordersByStatus,
        ]);
    }

    // ==========================================
    // PRODUCTS CMS
    // ==========================================

    public function getProducts(Request $request)
    {
        $query = Product::with(['category', 'brand'])->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $perPage = (int)$request->get('per_page', 20);
        return response()->json($query->paginate($perPage));
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'thumbnail' => 'nullable|string',
            'thumbnail_file' => 'nullable|image|max:5120', // max 5MB
            'model_3d' => 'nullable|file|max:51200', // max 50MB (removed strict mimes check due to finpo gltf/glb misidentification)
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'bg_type' => 'nullable|string|in:gradient,image,color',
            'bg_color' => 'nullable|string|max:100',
            'bg_gradient' => 'nullable|string',
            'bg_image' => 'nullable|string',
            'bg_image_file' => 'nullable|image|max:10240',
            'theme_color_mood' => 'nullable|string|max:255',
            'theme_light_mood' => 'nullable|string|max:255',
            'theme_watermark' => 'nullable|string|max:255',
            'model_scale' => 'nullable|numeric',
            'model_pos_x' => 'nullable|numeric',
            'model_pos_y' => 'nullable|numeric',
            'model_pos_z' => 'nullable|numeric',
            'model_rot_x' => 'nullable|numeric',
            'model_rot_y' => 'nullable|numeric',
            'model_rot_z' => 'nullable|numeric',
        ]);

        $data = $request->except(['model_3d', 'thumbnail_file', 'bg_image_file', 'delete_bg_image']);
        
        // Handle boolean values from FormData
        $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
        $data['is_trending'] = filter_var($request->is_trending, FILTER_VALIDATE_BOOLEAN);
        $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);

        $data['slug'] = Str::slug($request->title) . '-' . Str::random(5);
        if (empty($data['sku'])) {
            $data['sku'] = 'SKU-' . strtoupper(Str::random(8));
        }

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('products', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        if ($request->hasFile('bg_image_file')) {
            $path = $request->file('bg_image_file')->store('products/bg', 'public');
            $data['bg_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('model_3d')) {
            $path = $request->file('model_3d')->store('models', 'public');
            $data['model_3d'] = '/storage/' . $path;
        }

        $product = Product::create($data);
        return response()->json(['message' => 'Product created successfully', 'product' => $product->load(['category', 'brand'])], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'thumbnail' => 'nullable|string',
            'thumbnail_file' => 'nullable|image|max:5120', // max 5MB
            'model_3d' => 'nullable|file|max:51200', // max 50MB (removed strict mimes check due to finpo gltf/glb misidentification)
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'bg_type' => 'nullable|string|in:gradient,image,color',
            'bg_color' => 'nullable|string|max:100',
            'bg_gradient' => 'nullable|string',
            'bg_image' => 'nullable|string',
            'bg_image_file' => 'nullable|image|max:10240',
            'theme_color_mood' => 'nullable|string|max:255',
            'theme_light_mood' => 'nullable|string|max:255',
            'theme_watermark' => 'nullable|string|max:255',
            'model_scale' => 'nullable|numeric',
            'model_pos_x' => 'nullable|numeric',
            'model_pos_y' => 'nullable|numeric',
            'model_pos_z' => 'nullable|numeric',
            'model_rot_x' => 'nullable|numeric',
            'model_rot_y' => 'nullable|numeric',
            'model_rot_z' => 'nullable|numeric',
        ]);

        $data = $request->except(['model_3d', 'thumbnail_file', 'bg_image_file', 'delete_bg_image']);
        
        // Handle boolean values from FormData
        $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
        $data['is_trending'] = filter_var($request->is_trending, FILTER_VALIDATE_BOOLEAN);
        $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('products', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        if ($request->hasFile('bg_image_file')) {
            $path = $request->file('bg_image_file')->store('products/bg', 'public');
            $data['bg_image'] = '/storage/' . $path;
        } elseif ($request->boolean('delete_bg_image')) {
            $data['bg_image'] = null;
        }

        if ($request->hasFile('model_3d')) {
            $path = $request->file('model_3d')->store('models', 'public');
            $data['model_3d'] = '/storage/' . $path;
        }

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully', 'product' => $product->load(['category', 'brand'])]);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    // ==========================================
    // CATEGORIES CMS
    // ==========================================

    public function getCategories()
    {
        $categories = Category::withCount('products')->orderBy('sort_order', 'asc')->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $category = Category::create($data);

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $category->update($request->all());
        return response()->json(['message' => 'Category updated successfully', 'category' => $category]);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    // ==========================================
    // BRANDS CMS
    // ==========================================

    public function getBrands()
    {
        $brands = Brand::withCount('products')->latest()->get();
        return response()->json($brands);
    }

    public function storeBrand(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'logo' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $brand = Brand::create($data);

        return response()->json(['message' => 'Brand created successfully', 'brand' => $brand], 201);
    }

    public function updateBrand(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:100',
            'logo' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $brand->update($request->all());
        return response()->json(['message' => 'Brand updated successfully', 'brand' => $brand]);
    }

    public function deleteBrand($id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();
        return response()->json(['message' => 'Brand deleted successfully']);
    }

    // ==========================================
    // ORDERS CMS
    // ==========================================

    public function getOrders(Request $request)
    {
        $query = Order::with('items')->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('tracking_number', 'like', "%{$search}%");
            });
        }

        $perPage = (int)$request->get('per_page', 20);
        return response()->json($query->paginate($perPage));
    }

    public function showOrder($id)
    {
        $order = Order::with(['items', 'user'])->findOrFail($id);
        return response()->json($order);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|string|in:pending,processing,in_warehouse,shipped,delivered,cancelled,refunded',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
            'tracking_number' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $order->update($request->only(['order_status', 'payment_status', 'tracking_number', 'admin_notes']));

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load('items'),
        ]);
    }

    // ==========================================
    // CUSTOMERS CMS
    // ==========================================

    public function getCustomers(Request $request)
    {
        $query = User::where('role', 'customer')->withCount('orders')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $perPage = (int)$request->get('per_page', 20);
        return response()->json($query->paginate($perPage));
    }

    public function toggleCustomerStatus($id)
    {
        $customer = User::findOrFail($id);
        $customer->status = $customer->status === 'active' ? 'suspended' : 'active';
        $customer->save();

        return response()->json([
            'message' => "Customer status updated to {$customer->status}",
            'customer' => $customer,
        ]);
    }

    // ==========================================
    // BANNERS CMS
    // ==========================================

    public function getBanners()
    {
        $banners = Banner::orderBy('sort_order', 'asc')->get();
        return response()->json($banners);
    }

    public function storeBanner(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'highlight_text' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|string|max:255',
            'type' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'media_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,webm|max:20480',
            'media_type' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'bg_gradient' => 'nullable|string',
            'bg_image_file' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $data = $request->except(['media_file', 'bg_image_file']);
        $data['is_active'] = filter_var($request->is_active ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('media_file')) {
            $file = $request->file('media_file');
            $path = $file->store('banners', 'public');
            $data['image_url'] = '/storage/' . $path;
            $data['media_type'] = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image';
        }

        if ($request->hasFile('bg_image_file')) {
            $file = $request->file('bg_image_file');
            $path = $file->store('banners/backgrounds', 'public');
            $data['bg_image_url'] = '/storage/' . $path;
        }

        $banner = Banner::create($data);
        return response()->json(['message' => 'Banner created successfully', 'banner' => $banner], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation Failed (storeBanner)', $e->errors());
            throw $e;
        }
    }

    public function updateBanner(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        
        try {
            $request->validate([
                'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'highlight_text' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|string|max:255',
            'type' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'media_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,webm|max:20480',
            'media_type' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'bg_gradient' => 'nullable|string',
            'bg_image_file' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $data = $request->except(['media_file', 'bg_image_file']);
        $data['is_active'] = filter_var($request->is_active ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('media_file')) {
            $file = $request->file('media_file');
            $path = $file->store('banners', 'public');
            $data['image_url'] = '/storage/' . $path;
            $data['media_type'] = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image';
        }

        if ($request->hasFile('bg_image_file')) {
            $file = $request->file('bg_image_file');
            $path = $file->store('banners/backgrounds', 'public');
            $data['bg_image_url'] = '/storage/' . $path;
        }

        $banner->update($data);
        return response()->json(['message' => 'Banner updated successfully', 'banner' => $banner]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation Failed (updateBanner)', $e->errors());
            throw $e;
        }
    }

    public function deleteBanner($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        return response()->json(['message' => 'Banner deleted successfully']);
    }

    // ==========================================
    // COUPONS CMS
    // ==========================================

    public function getCoupons()
    {
        $coupons = Coupon::latest()->get();
        return response()->json($coupons);
    }

    public function storeCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['code'] = strtoupper(trim($request->code));
        $coupon = Coupon::create($data);

        return response()->json(['message' => 'Coupon created successfully', 'coupon' => $coupon], 201);
    }

    public function updateCoupon(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['code'] = strtoupper(trim($request->code));
        $coupon->update($data);

        return response()->json(['message' => 'Coupon updated successfully', 'coupon' => $coupon]);
    }

    public function deleteCoupon($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted successfully']);
    }

    // ==========================================
    // REVIEWS CMS
    // ==========================================

    public function getReviews()
    {
        $reviews = Review::with('product')->latest()->paginate(20);
        return response()->json($reviews);
    }

    public function toggleReviewApproval($id)
    {
        $review = Review::findOrFail($id);
        $review->is_approved = !$review->is_approved;
        $review->save();

        return response()->json([
            'message' => 'Review status toggled',
            'review' => $review,
        ]);
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }

    // ==========================================
    // SETTINGS CMS
    // ==========================================

    public function getSettings()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateSettings(Request $request)
    {
        $settingsData = $request->except([
            'loading_logo_file', 'header_logo_file', 'footer_logo_file',
            'delete_loading_logo', 'delete_header_logo', 'delete_footer_logo',
            'showcase_bg_image_file', 'delete_showcase_bg_image'
        ]);

        foreach ($settingsData as $key => $value) {
            if ($value === 'null') $value = null; // FormData sends 'null' as string sometimes
            if (!is_array($value) && !is_object($value)) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        $settingsDir = public_path('settings');
        if (!file_exists($settingsDir)) {
            @mkdir($settingsDir, 0755, true);
        }

        if ($request->hasFile('loading_logo_file')) {
            $file = $request->file('loading_logo_file');
            $filename = time() . '_loading.' . $file->getClientOriginalExtension();
            $file->move($settingsDir, $filename);
            Setting::updateOrCreate(['key' => 'loading_logo'], ['value' => '/settings/' . $filename]);
        } elseif ($request->boolean('delete_loading_logo')) {
            Setting::updateOrCreate(['key' => 'loading_logo'], ['value' => null]);
        }

        if ($request->hasFile('header_logo_file')) {
            $file = $request->file('header_logo_file');
            $filename = time() . '_header.' . $file->getClientOriginalExtension();
            $file->move($settingsDir, $filename);
            Setting::updateOrCreate(['key' => 'header_logo'], ['value' => '/settings/' . $filename]);
        } elseif ($request->boolean('delete_header_logo')) {
            Setting::updateOrCreate(['key' => 'header_logo'], ['value' => null]);
        }

        if ($request->hasFile('footer_logo_file')) {
            $file = $request->file('footer_logo_file');
            $filename = time() . '_footer.' . $file->getClientOriginalExtension();
            $file->move($settingsDir, $filename);
            Setting::updateOrCreate(['key' => 'footer_logo'], ['value' => '/settings/' . $filename]);
        } elseif ($request->boolean('delete_footer_logo')) {
            Setting::updateOrCreate(['key' => 'footer_logo'], ['value' => null]);
        }

        if ($request->hasFile('showcase_bg_image_file')) {
            $file = $request->file('showcase_bg_image_file');
            $filename = time() . '_showcase_bg.' . $file->getClientOriginalExtension();
            $file->move($settingsDir, $filename);
            Setting::updateOrCreate(['key' => 'showcase_bg_image_url'], ['value' => '/settings/' . $filename]);
        } elseif ($request->boolean('delete_showcase_bg_image')) {
            Setting::updateOrCreate(['key' => 'showcase_bg_image_url'], ['value' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings saved successfully',
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }

    // ==========================================
    // BENEFITS CMS
    // ==========================================
    public function getBenefits()
    {
        return response()->json(Benefit::orderBy('display_order', 'asc')->get());
    }

    public function storeBenefit(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'subtitle' => 'nullable|string',
            'description' => 'nullable|string',
            'old_text' => 'nullable|string',
            'new_text' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'display_order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $benefit = Benefit::create($validated);
        return response()->json($benefit);
    }

    public function updateBenefit(Request $request, $id)
    {
        $benefit = Benefit::findOrFail($id);
        $benefit->update($request->all());
        return response()->json($benefit);
    }

    public function deleteBenefit($id)
    {
        Benefit::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ==========================================
    // FAQS CMS
    // ==========================================
    public function getFaqs()
    {
        return response()->json(Faq::orderBy('display_order', 'asc')->get());
    }

    public function storeFaq(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'display_order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $faq = Faq::create($validated);
        return response()->json($faq);
    }

    public function updateFaq(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->update($request->all());
        return response()->json($faq);
    }

    public function deleteFaq($id)
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ==========================================
    // NEWSLETTERS CMS
    // ==========================================
    public function getNewsletters()
    {
        return response()->json(Newsletter::latest()->get());
    }
}
