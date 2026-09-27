<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::create([
            'name' => 'Brand Admin',
            'email' => 'admin@m3s.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '+1 (555) 019-2834',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            'address' => '100 Streetwear Boulevard, Studio 4A',
            'city' => 'New York',
            'postal_code' => '10001',
            'status' => 'active',
        ]);

        $customer = User::create([
            'name' => 'Alex Rivera',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1 (555) 839-1029',
            'avatar' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
            'address' => '742 Broadway Avenue',
            'city' => 'Los Angeles',
            'postal_code' => '90015',
            'status' => 'active',
        ]);

        // 2. Settings (Ciao Energy inspired T-Shirt Brand)
        $settings = [
            ['key' => 'store_name', 'value' => 'M3S Apparel', 'type' => 'text', 'group' => 'general'],
            ['key' => 'store_tagline', 'value' => 'The Perfect Heavyweight Streetwear Tee. 240 GSM Organic Cotton.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'store_email', 'value' => 'orders@m3sapparel.com', 'type' => 'text', 'group' => 'general'],
            ['key' => 'store_phone', 'value' => '+1 (800) 555-TEES', 'type' => 'text', 'group' => 'general'],
            ['key' => 'store_address', 'value' => 'Dhaka, Bangladesh', 'type' => 'text', 'group' => 'general'],
            ['key' => 'currency_symbol', 'value' => '৳', 'type' => 'text', 'group' => 'store'],
            ['key' => 'currency_code', 'value' => 'BDT', 'type' => 'text', 'group' => 'store'],
            ['key' => 'shipping_standard_fee', 'value' => '60.00', 'type' => 'text', 'group' => 'shipping'],
            ['key' => 'shipping_express_fee', 'value' => '120.00', 'type' => 'text', 'group' => 'shipping'],
            ['key' => 'free_shipping_min', 'value' => '1500.00', 'type' => 'text', 'group' => 'shipping'],
            ['key' => 'tax_rate_percent', 'value' => '0.00', 'type' => 'text', 'group' => 'store'],
            ['key' => 'announcement_bar', 'value' => '🔥 SPECIAL LAUNCH: Get 10% OFF with code WELCOME10 | Free delivery all over Bangladesh', 'type' => 'text', 'group' => 'general'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com', 'type' => 'text', 'group' => 'social'],
            ['key' => 'twitter_url', 'value' => 'https://twitter.com', 'type' => 'text', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com', 'type' => 'text', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        // 3. Brands / Collections Line
        $brandsData = [
            ['name' => 'M3S Studio', 'slug' => 'm3s-studio', 'logo' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'],
            ['name' => 'Heavyweight Lab', 'slug' => 'heavyweight-lab', 'logo' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80'],
            ['name' => 'Tokyo Cyber Division', 'slug' => 'tokyo-cyber-division', 'logo' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=150&q=80'],
            ['name' => 'Raw Essentials', 'slug' => 'raw-essentials', 'logo' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=150&q=80'],
        ];

        $brands = [];
        foreach ($brandsData as $b) {
            $brands[$b['slug']] = Brand::create($b);
        }

        // 4. Categories (T-Shirt Collections matching scroll-story panels)
        $categoriesData = [
            [
                'name' => 'Streetwear Drops',
                'slug' => 'streetwear-drops',
                'icon' => 'Flame',
                'image' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
                'description' => 'Bold graphic screen prints, oversized silhouettes, raw urban edge.',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Heavyweight Basics',
                'slug' => 'heavyweight-basics',
                'icon' => 'Shirt',
                'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
                'description' => '240 GSM luxury combed cotton blanks. Zero see-through, never loses shape.',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Oversized Boxy Fit',
                'slug' => 'oversized-boxy-fit',
                'icon' => 'Maximize2',
                'image' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85',
                'description' => 'Dropped shoulders, boxy relaxed drape, reinforced 1x1 tight ribbed collar.',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Graphic & Typo Tees',
                'slug' => 'graphic-tees',
                'icon' => 'Sparkles',
                'image' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85',
                'description' => 'High-density screen prints and typography that last 50+ wash cycles.',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Vintage Acid Wash',
                'slug' => 'vintage-acid-wash',
                'icon' => 'Sun',
                'image' => 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=85',
                'description' => 'Hand-dyed mineral acid washes. Super soft-hand feel with worn-in retro drape.',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Limited Artist Drop',
                'slug' => 'limited-artist-drop',
                'icon' => 'Crown',
                'image' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=85',
                'description' => 'Numbered collector editions with embossed metallic hem tags.',
                'is_featured' => true,
                'sort_order' => 6,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // 5. Banners (Hero Scroll Story Slides)
        Banner::create([
            'title' => 'M3S — The Perfect Heavyweight Tee.',
            'subtitle' => '240 GSM Luxury Organic Cotton. Pre-shrunk & Tailored for the Ultimate Boxy Drape.',
            'highlight_text' => 'DROP 04 IS LIVE',
            'image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=85',
            'button_text' => 'SHOP DROP 04',
            'button_url' => '/shop',
            'type' => 'hero_slider',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Banner::create([
            'title' => 'Heavyweight 240 GSM Basics Collection.',
            'subtitle' => 'Zero see-through. Reinforced tight collar that never sags after washing.',
            'highlight_text' => 'RESTOCKED IN 6 TONES',
            'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=85',
            'button_text' => 'EXPLORE BASICS',
            'button_url' => '/shop?category=heavyweight-basics',
            'type' => 'hero_slider',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Banner::create([
            'title' => 'Acid Wash & Vintage Mineral Dyes.',
            'subtitle' => 'Hand-processed for an authentic worn-in drape with butter-soft hand feel.',
            'highlight_text' => 'LIMITED DROP',
            'image_url' => 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1400&q=85',
            'button_text' => 'VIEW ACID WASH',
            'button_url' => '/shop?category=vintage-acid-wash',
            'type' => 'hero_slider',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // 6. Products (Authentic Premium T-Shirts)
        $productsData = [
            [
                'title' => 'Heavyweight Boxy Tee — Vintage Faded Black',
                'slug' => 'heavyweight-boxy-tee-vintage-black',
                'sku' => 'M3S-BOX-BLK',
                'barcode' => '893810291011',
                'short_description' => '240 GSM ultra-heavy combed cotton with dropped shoulders and relaxed boxy drape.',
                'description' => "Our signature silhouette. Crafted from custom-knit 240 GSM 100% combed cotton, this heavyweight tee delivers the perfect structured boxy drape without feeling stiff.\n\nKey Details:\n- 240 GSM Heavyweight 100% Organic Combed Cotton\n- Pre-shrunk fabric to preserve sizing wash after wash\n- 1x1 tight ribbed collar with double-needle reinforced stitching (guaranteed no bacon neck)\n- Bio-washed for a buttery soft-hand touch\n- True-to-size boxy streetwear cut (size up for oversized look)",
                'price' => 38.00,
                'compare_price' => 48.00,
                'cost_price' => 16.00,
                'stock_quantity' => 45,
                'low_stock_threshold' => 8,
                'thumbnail' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Vintage Faded Black', 'Washed Charcoal', 'Pure Snow White'],
                    'gsm' => '240 GSM Heavyweight',
                    'fit' => 'Boxy Relaxed Fit',
                ],
                'category_id' => $categories['streetwear-drops']->id,
                'brand_id' => $brands['m3s-studio']->id,
                'rating' => 4.96,
                'review_count' => 124,
                'is_featured' => true,
                'is_trending' => true,
                'is_new' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Tokyo Cyber Samurai Graphic Tee — Bone White',
                'slug' => 'tokyo-cyber-samurai-graphic-tee',
                'sku' => 'M3S-CYB-WHT',
                'barcode' => '893810291012',
                'short_description' => 'High-density puff screen print on 240 GSM organic cotton. Built to never crack.',
                'description' => "Featuring high-density screen-printed Tokyo Cyber graphics on front chest and oversized back statement art. Hand-printed with eco-friendly plastisol inks cured at high temperatures for long-lasting vibrancy that survives 50+ wash cycles.",
                'price' => 44.00,
                'compare_price' => 54.00,
                'cost_price' => 18.00,
                'stock_quantity' => 32,
                'low_stock_threshold' => 6,
                'thumbnail' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Bone White', 'Onyx Black', 'Cyber Cobalt'],
                    'gsm' => '240 GSM Heavyweight',
                    'fit' => 'Oversized Streetwear Fit',
                ],
                'category_id' => $categories['graphic-tees']->id,
                'brand_id' => $brands['tokyo-cyber-division']->id,
                'rating' => 4.91,
                'review_count' => 88,
                'is_featured' => true,
                'is_trending' => true,
                'is_new' => true,
                'is_active' => true,
            ],
            [
                'title' => '240 GSM Luxury Essential Blank Tee — Olive Moss',
                'slug' => 'luxury-essential-blank-tee-olive',
                'sku' => 'M3S-ESN-OLV',
                'barcode' => '893810291013',
                'short_description' => 'Clean, zero-branding essential tee. Ultra-soft combed cotton with crisp drape.',
                'description' => "The ultimate wardrobe foundation. Tailored for daily wear with thick 240 GSM organic cotton that holds its structure and never turns see-through in daylight. Finished with blind-stitch hem.",
                'price' => 34.00,
                'compare_price' => 42.00,
                'cost_price' => 14.00,
                'stock_quantity' => 50,
                'low_stock_threshold' => 10,
                'thumbnail' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Olive Moss', 'Sandstone Beige', 'Midnight Navy', 'Pure White'],
                    'gsm' => '240 GSM Heavyweight',
                    'fit' => 'Classic Modern Fit',
                ],
                'category_id' => $categories['heavyweight-basics']->id,
                'brand_id' => $brands['raw-essentials']->id,
                'rating' => 4.89,
                'review_count' => 76,
                'is_featured' => true,
                'is_trending' => false,
                'is_new' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Mineral Acid Wash Oversized Tee — Charcoal Storm',
                'slug' => 'mineral-acid-wash-oversized-tee',
                'sku' => 'M3S-ACD-CHR',
                'barcode' => '893810291014',
                'short_description' => 'Hand-processed mineral acid wash. Every single shirt features a unique pattern.',
                'description' => "Each piece is hand-dyed with raw pumice minerals to achieve an authentic vintage texture. Double bio-washed for extra softness with seamless side construction and heavy ribbed collar.",
                'price' => 42.00,
                'compare_price' => 52.00,
                'cost_price' => 17.00,
                'stock_quantity' => 28,
                'low_stock_threshold' => 5,
                'thumbnail' => 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Charcoal Storm', 'Washed Rose', 'Sage Grey'],
                    'gsm' => '230 GSM Vintage Wash',
                    'fit' => 'Oversized Boxy Drape',
                ],
                'category_id' => $categories['vintage-acid-wash']->id,
                'brand_id' => $brands['m3s-studio']->id,
                'rating' => 4.95,
                'review_count' => 64,
                'is_featured' => true,
                'is_trending' => true,
                'is_new' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Minimalist Typo Statement Tee — Sandstone Cream',
                'slug' => 'minimalist-typo-statement-tee',
                'sku' => 'M3S-TYP-SND',
                'barcode' => '893810291015',
                'short_description' => 'Subtle high-density chest typography on heavyweight cream cotton.',
                'description' => "Minimal architectural typography embossed with micro puff ink on heavyweight 240 GSM organic cotton. Clean, understated, and versatile for styling under overshirts or alone.",
                'price' => 36.00,
                'compare_price' => 45.00,
                'cost_price' => 15.00,
                'stock_quantity' => 38,
                'low_stock_threshold' => 6,
                'thumbnail' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Sandstone Cream', 'Pitch Black', 'Forest Pine'],
                    'gsm' => '240 GSM Heavyweight',
                    'fit' => 'Boxy Streetwear Fit',
                ],
                'category_id' => $categories['oversized-boxy-fit']->id,
                'brand_id' => $brands['heavyweight-lab']->id,
                'rating' => 4.82,
                'review_count' => 49,
                'is_featured' => false,
                'is_trending' => true,
                'is_new' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Signature Embroidered Emblem Tee — Limited Edition',
                'slug' => 'signature-embroidered-emblem-tee',
                'sku' => 'M3S-EMB-LTD',
                'barcode' => '893810291016',
                'short_description' => 'Precision satin-stitched metallic chest emblem with numbered woven hem label.',
                'description' => "Part of our Collector Series. Limited to only 500 numbered shirts worldwide. Features a high-density satin embroidered logo on left chest and custom metal-tipped drawcord accents on matching apparel.",
                'price' => 48.00,
                'compare_price' => 60.00,
                'cost_price' => 20.00,
                'stock_quantity' => 4, // LOW STOCK test
                'low_stock_threshold' => 5,
                'thumbnail' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
                ],
                'attributes' => [
                    'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                    'colors' => ['Limited Steel Grey', 'Matte Black'],
                    'gsm' => '250 GSM Ultra-Heavyweight',
                    'fit' => 'Custom Tailored Boxy Fit',
                ],
                'category_id' => $categories['limited-artist-drop']->id,
                'brand_id' => $brands['m3s-studio']->id,
                'rating' => 4.98,
                'review_count' => 31,
                'is_featured' => true,
                'is_trending' => true,
                'is_new' => true,
                'is_active' => true,
            ],
        ];

        $createdProducts = [];
        foreach ($productsData as $p) {
            $product = Product::create($p);
            $createdProducts[] = $product;

            Review::create([
                'product_id' => $product->id,
                'user_id' => $customer->id,
                'customer_name' => 'Alex Rivera',
                'customer_email' => 'customer@example.com',
                'rating' => 5,
                'title' => 'Best 240 GSM heavyweight tee I have ever owned!',
                'comment' => 'The fabric thickness is unreal! Zero see-through in sunlight, and the collar stays totally stiff and clean even after washing. Definitely replacing all my basic tees with M3S.',
                'is_approved' => true,
                'is_verified_purchase' => true,
            ]);

            Review::create([
                'product_id' => $product->id,
                'user_id' => null,
                'customer_name' => 'Marcus Vance',
                'customer_email' => 'marcus.v@example.com',
                'rating' => 5,
                'title' => 'Perfect boxy drape and high quality screen print.',
                'comment' => 'Ordered size L and the drop shoulder fit is identical to $150 designer tees. Super happy with the fast delivery.',
                'is_approved' => true,
                'is_verified_purchase' => true,
            ]);
        }

        // 7. Coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10.00,
            'min_spend' => 30.00,
            'max_discount' => 50.00,
            'usage_limit' => 1000,
            'used_count' => 45,
            'expires_at' => now()->addMonths(6),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'DROP15',
            'type' => 'fixed',
            'value' => 15.00,
            'min_spend' => 80.00,
            'max_discount' => 15.00,
            'usage_limit' => 300,
            'used_count' => 22,
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
        ]);

        // 8. Sample Demo Order
        $order1 = Order::create([
            'order_number' => 'M3S-77210',
            'user_id' => $customer->id,
            'customer_name' => 'Alex Rivera',
            'customer_email' => 'customer@example.com',
            'customer_phone' => '+1 (555) 839-1029',
            'shipping_address' => '742 Broadway Avenue',
            'shipping_city' => 'Los Angeles',
            'shipping_postal' => '90015',
            'shipping_notes' => 'Leave at front gate.',
            'subtotal' => 82.00,
            'discount_amount' => 8.20,
            'shipping_fee' => 0.00,
            'tax_amount' => 0.00,
            'total_amount' => 73.80,
            'coupon_code' => 'WELCOME10',
            'shipping_method' => 'Free Express Courier',
            'payment_method' => 'card',
            'payment_status' => 'paid',
            'order_status' => 'shipped',
            'tracking_number' => 'TRK-US-7721094',
            'admin_notes' => 'Dispatched via DHL Express.',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $createdProducts[0]->id,
            'product_title' => $createdProducts[0]->title,
            'product_sku' => $createdProducts[0]->sku,
            'product_thumbnail' => $createdProducts[0]->thumbnail,
            'unit_price' => 38.00,
            'quantity' => 1,
            'total_price' => 38.00,
            'options' => ['size' => 'L', 'color' => 'Vintage Faded Black'],
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $createdProducts[1]->id,
            'product_title' => $createdProducts[1]->title,
            'product_sku' => $createdProducts[1]->sku,
            'product_thumbnail' => $createdProducts[1]->thumbnail,
            'unit_price' => 44.00,
            'quantity' => 1,
            'total_price' => 44.00,
            'options' => ['size' => 'L', 'color' => 'Bone White'],
        ]);
    }
}
