<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Review;
use App\Models\Banner;

class CarGadgetsSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Brands ───────────────────────────────────────────────────────────
        $brandsData = [
            [
                'name' => 'Little Trees',
                'slug' => 'little-trees',
                'logo' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=150&q=80',
            ],
            [
                'name' => 'LP Smart Gear',
                'slug' => 'lp-smart-gear',
                'logo' => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=150&q=80',
            ],
            [
                'name' => 'AutoTech HUD',
                'slug' => 'autotech-hud',
                'logo' => 'https://images.unsplash.com/photo-1596979046558-21c6c00ecdaa?auto=format&fit=crop&w=150&q=80',
            ],
        ];

        $brands = [];
        foreach ($brandsData as $b) {
            $brands[$b['slug']] = Brand::firstOrCreate(['slug' => $b['slug']], $b);
        }

        // ─── Categories ───────────────────────────────────────────────────────
        $categoriesData = [
            [
                'name'        => 'Car Air Fresheners',
                'slug'        => 'car-air-fresheners',
                'icon'        => 'Wind',
                'image'       => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
                'description' => 'প্রিমিয়াম অটোমোটিভ ফ্র্যাগরেন্স — প্রতিটি যাত্রায় সতেজ সুবাস।',
                'is_featured' => true,
                'sort_order'  => 10,
            ],
            [
                'name'        => 'Tire & Safety Tools',
                'slug'        => 'tire-safety-tools',
                'icon'        => 'Gauge',
                'image'       => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=85',
                'description' => 'স্মার্ট টায়ার ইনফ্লেটর ও রোড সেফটি গ্যাজেট।',
                'is_featured' => true,
                'sort_order'  => 11,
            ],
            [
                'name'        => 'Car Electronics & HUD',
                'slug'        => 'car-electronics-hud',
                'icon'        => 'Monitor',
                'image'       => 'https://images.unsplash.com/photo-1596979046558-21c6c00ecdaa?auto=format&fit=crop&w=800&q=85',
                'description' => 'ড্যাশবোর্ড ডিসপ্লে, GPS স্পিডোমিটার ও স্মার্ট ড্রাইভিং গ্যাজেট।',
                'is_featured' => true,
                'sort_order'  => 12,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::firstOrCreate(['slug' => $c['slug']], $c);
        }

        // ─── Banners ──────────────────────────────────────────────────────────
        Banner::firstOrCreate(['title' => 'Little Trees — প্রতিটি ড্রাইভে স্বাক্ষরিত সুবাস'], [
            'title'          => 'Little Trees — প্রতিটি ড্রাইভে স্বাক্ষরিত সুবাস',
            'subtitle'       => 'বিশ্বব্যাপী পরিচিত প্রিমিয়াম অটোমোটিভ ফ্র্যাগরেন্স। ১০টি স্বতন্ত্র সুবাস থেকে বেছে নিন।',
            'highlight_text' => '১০ টি ফ্র্যাগরেন্স এখন উপলব্ধ',
            'image_url'      => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85',
            'button_text'    => 'এখনই শপ করুন',
            'button_url'     => '/shop?category=car-air-fresheners',
            'type'           => 'hero_slider',
            'is_active'      => true,
            'sort_order'     => 10,
        ]);

        Banner::firstOrCreate(['title' => 'LP17 Smart Tire Inflator — যেকোনো পথে প্রস্তুত'], [
            'title'          => 'LP17 Smart Tire Inflator — যেকোনো পথে প্রস্তুত',
            'subtitle'       => '150 PSI · 4000mAh ব্যাটারি · LED ডিসপ্লে · Auto-Stop · USB-C চার্জিং',
            'highlight_text' => 'NEW ARRIVAL',
            'image_url'      => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=85',
            'button_text'    => 'LP17 দেখুন',
            'button_url'     => '/shop?category=tire-safety-tools',
            'type'           => 'hero_slider',
            'is_active'      => true,
            'sort_order'     => 11,
        ]);

        // ─── Products ─────────────────────────────────────────────────────────
        $productsData = [

            // ── Product 1: Little Trees Air Fresheners ─────────────────────
            [
                'title'             => 'Little Trees Car Air Freshener — Multi-Fragrance Pack',
                'slug'              => 'little-trees-car-air-freshener-multi-pack',
                'sku'               => 'LT-AIR-MULTI',
                'barcode'           => '070154000123',
                'short_description' => 'বিশ্বব্যাপী পরিচিত Little Trees Air Freshener — ১০টি স্বতন্ত্র সুবাস থেকে বেছে নিন।',
                'description'       => "LITTLE TREES — প্রতিটি ড্রাইভে স্বাক্ষরিত সুবাস\n\nআপনার ড্রাইভিং অভিজ্ঞতাকে আরও উন্নত করে তুলুন Little Trees Air Fresheners-এর সঙ্গে।\n\nAvailable Fragrances:\n• Vanillaroma — মসৃণ, উষ্ণ ও বিলাসবহুল ভ্যানিলার সুবাস\n• Lemon Grove — প্রাণবন্ত লেবু ও সাইট্রাসের সতেজ সুবাস\n• Strawberry — মিষ্টি ও রসালো স্ট্রবেরির প্রাণবন্ত ফ্রুটি সুবাস\n• Wild Cherry — সমৃদ্ধ চেরির ঘ্রাণ, মিষ্টি ও স্বতন্ত্র\n• New Car — একদম নতুন গাড়ির সেই পরিচিত ফ্রেশ সুবাস\n• Black Ice — শক্তিশালী, কুল ও রিফাইন্ড পুরুষালি সুবাস\n• Pina Colada — আনারস ও ক্রিমি নারকেলের ট্রপিক্যাল সংমিশ্রণ\n• Bayside Breeze — সমুদ্রতীরের নির্মল বাতাসের অনুভূতি\n• American Flag — ক্রিস্প, ক্লিন ও ক্লাসিক সুবাস\n• Peachy Peach — পাকা পিচের মিষ্টি, রসালো ও সতেজ সুবাস\n\nLittle Trees — প্রিমিয়াম সুবাস, অনায়াসে পরিশীলিত.",
                'price'             => 250.00,
                'compare_price'     => 320.00,
                'cost_price'        => 120.00,
                'stock_quantity'    => 200,
                'low_stock_threshold' => 20,
                'thumbnail'         => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
                'gallery'           => json_encode([
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
                ]),
                'attributes'        => json_encode([
                    'fragrance' => ['Vanillaroma','Lemon Grove','Strawberry','Wild Cherry','New Car','Black Ice','Pina Colada','Bayside Breeze','American Flag','Peachy Peach'],
                    'pack_size' => ['Single','3-Pack','6-Pack'],
                    'type'      => 'Hanging Air Freshener',
                    'duration'  => 'Up to 7 weeks',
                ]),
                'category_id'       => $categories['car-air-fresheners']->id,
                'brand_id'          => $brands['little-trees']->id,
                'rating'            => 4.88,
                'review_count'      => 312,
                'is_featured'       => true,
                'is_trending'       => true,
                'is_new'            => false,
                'is_active'         => true,
                'seo_title'         => 'Little Trees Car Air Freshener | Best Car Fragrance Bangladesh',
                'seo_desc'          => 'Buy genuine Little Trees Car Air Fresheners. 10 premium fragrances: Vanillaroma, Black Ice, New Car & more.',
            ],

            // ── Product 2: LP17 Smart Tire Inflator ───────────────────────
            [
                'title'             => 'LP17 Smart Car Tire Inflator — 150 PSI Portable Pump',
                'slug'              => 'lp17-smart-car-tire-inflator',
                'sku'               => 'LP17-TIRE-PUMP',
                'barcode'           => '8801234567890',
                'short_description' => 'আধুনিক ড্রাইভারের জন্য কমপ্যাক্ট ও নির্ভরযোগ্য টায়ার পাম্প। ১৫০ PSI, ৪০০০mAh ব্যাটারি, LED ডিসপ্লে, Auto-Stop।',
                'description'       => "LP17 Smart Car Tire Inflator\n\nআধুনিক ড্রাইভারের জন্য একটি প্রিমিয়াম, কমপ্যাক্ট ও নির্ভরযোগ্য সমাধান।\n\nKey Specifications:\n• সর্বোচ্চ ১৫০ PSI, এয়ারফ্লো ১৬-১৮ L/min\n• PSI, BAR, KPA ও Kg/cm2 ইউনিট সাপোর্ট\n• পাওয়ার ব্যাংক ফাংশন ও LED ইমার্জেন্সি লাইট\n• 4000mAh Li-ion ব্যাটারি\n• মাত্র ২ ঘণ্টায় ফুল চার্জ\n• ৫টি স্মার্ট মোড: Car / Bike / Bicycle / Ball / Custom\n\nIn The Box:\n• LP17 Tire Inflator Unit\n• Schrader hose\n• Needle valve\n• Presta adapter\n• USB-C charging cable\n\nLP17 — স্মার্ট প্রযুক্তি, নিশ্চিন্ত যাত্রা। যেকোনো সময়, যেকোনো পথে।",
                'price'             => 1850.00,
                'compare_price'     => 2200.00,
                'cost_price'        => 900.00,
                'stock_quantity'    => 75,
                'low_stock_threshold' => 10,
                'thumbnail'         => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
                'gallery'           => json_encode([
                    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80',
                ]),
                'attributes'        => json_encode([
                    'max_pressure'   => '150 PSI',
                    'airflow'        => '16-18 L/min',
                    'battery'        => '4000mAh Li-ion',
                    'charge_time'    => '~2 hours',
                    'charging_port'  => 'USB-C',
                    'pressure_units' => ['PSI','BAR','KPA','Kg/cm2'],
                    'modes'          => ['Car','Bike','Bicycle','Ball','Custom'],
                    'color'          => ['Matte Black','Space Grey'],
                    'extra_features' => ['Power Bank','LED Emergency Light','Auto-Stop'],
                ]),
                'category_id'       => $categories['tire-safety-tools']->id,
                'brand_id'          => $brands['lp-smart-gear']->id,
                'rating'            => 4.92,
                'review_count'      => 187,
                'is_featured'       => true,
                'is_trending'       => true,
                'is_new'            => true,
                'is_active'         => true,
                'seo_title'         => 'LP17 Smart Tire Inflator | Portable Car Pump 150 PSI Bangladesh',
                'seo_desc'          => 'Buy LP17 Smart Car Tire Inflator. 150 PSI, 4000mAh battery, LED display, Auto-Stop, USB-C. Best portable pump for car, bike & bicycle.',
            ],

            // ── Product 3: Universal GPS Car HUD Speedometer ──────────────
            [
                'title'             => 'Universal GPS Car HUD Digital Speedometer — Head-Up Display',
                'slug'              => 'universal-gps-car-hud-digital-speedometer',
                'sku'               => 'HUD-GPS-SPD01',
                'barcode'           => '6912345678901',
                'short_description' => 'GPS-ভিত্তিক হেড-আপ ডিসপ্লে — বড় ডিজিটাল স্পিড রিডিং, উইন্ডশিল্ড প্রজেকশন, KM/H ও MPH সাপোর্ট।',
                'description'       => "Universal GPS Car HUD Digital Speedometer\n\nProduct Type: Head-Up Display (HUD)\n\nKey Features:\n• Large Digital Speed Display — ড্রাইভিংয়ের সময় সহজে পড়া যায়\n• GPS-Based Speed Measurement — OBD ছাড়াই সঠিক গতি পরিমাপ\n• Windshield Projection — রিফ্লেক্টিভ ফিল্মে স্পিড দেখা যায়\n• KM/H & MPH Support — দুটি ইউনিটের মধ্যে সুইচ করুন\n• USB Plug & Play — যেকোনো USB পোর্টে কানেক্ট করুন\n• Automatic Power On/Off — গাড়ি চালু হলে অটো-স্টার্ট\n• Compact Design — ড্যাশবোর্ডে কম জায়গা নেয়\n• No OBD Required — সব গাড়িতে সামঞ্জস্যপূর্ণ\n• Day/Night Visibility — অটো ব্রাইটনেস অ্যাডজাস্টমেন্ট\n\nWhat's In The Box:\n• 1x HUD Digital Speedometer\n• 1x USB Power Cable\n• 1x Reflective Windshield Film\n• 1x Dashboard Non-Slip Mounting Pad\n• Protective accessories",
                'price'             => 1200.00,
                'compare_price'     => 1600.00,
                'cost_price'        => 550.00,
                'stock_quantity'    => 60,
                'low_stock_threshold' => 8,
                'thumbnail'         => 'https://images.unsplash.com/photo-1596979046558-21c6c00ecdaa?auto=format&fit=crop&w=800&q=80',
                'gallery'           => json_encode([
                    'https://images.unsplash.com/photo-1596979046558-21c6c00ecdaa?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
                ]),
                'attributes'        => json_encode([
                    'display_type'  => 'Head-Up Display (HUD)',
                    'speed_units'   => ['KM/H','MPH'],
                    'power'         => 'USB',
                    'gps'           => 'Built-in GPS',
                    'obd_required'  => 'No — GPS-based',
                    'brightness'    => 'Auto Day/Night',
                    'compatibility' => 'Universal (Car, SUV, Truck)',
                    'color'         => ['Black'],
                    'features'      => ['Auto Power On/Off','Windshield Projection','Plug & Play'],
                ]),
                'category_id'       => $categories['car-electronics-hud']->id,
                'brand_id'          => $brands['autotech-hud']->id,
                'rating'            => 4.78,
                'review_count'      => 143,
                'is_featured'       => true,
                'is_trending'       => true,
                'is_new'            => true,
                'is_active'         => true,
                'seo_title'         => 'GPS Car HUD Digital Speedometer Bangladesh | Head Up Display',
                'seo_desc'          => 'Buy Universal GPS Car HUD Digital Speedometer. Windshield projection, KM/H & MPH, USB plug & play, no OBD required.',
            ],
        ];

        foreach ($productsData as $p) {
            $product = Product::firstOrCreate(['slug' => $p['slug']], $p);

            Review::firstOrCreate(
                ['product_id' => $product->id, 'customer_email' => 'rahim.driver@example.com'],
                [
                    'product_id'           => $product->id,
                    'user_id'              => null,
                    'customer_name'        => 'Md. Rahim Uddin',
                    'customer_email'       => 'rahim.driver@example.com',
                    'rating'               => 5,
                    'title'                => 'অসাধারণ প্রোডাক্ট! সত্যিই কাজের।',
                    'comment'              => 'প্রোডাক্টটা পেয়ে সত্যিই অবাক হয়ে গেলাম। মানটা একদম টপ নচ। ডেলিভারিও খুব দ্রুত হয়েছে। সবাইকে রেকমেন্ড করব।',
                    'is_approved'          => true,
                    'is_verified_purchase' => true,
                ]
            );

            Review::firstOrCreate(
                ['product_id' => $product->id, 'customer_email' => 'tanvir.auto@example.com'],
                [
                    'product_id'           => $product->id,
                    'user_id'              => null,
                    'customer_name'        => 'Tanvir Ahmed',
                    'customer_email'       => 'tanvir.auto@example.com',
                    'rating'               => 5,
                    'title'                => 'দারুণ কোয়ালিটি, দাম একদম সঠিক!',
                    'comment'              => 'গাড়িতে লাগিয়ে দেখলাম পারফেক্ট কাজ করছে। এই দামে এত ভালো প্রোডাক্ট আশা করিনি। আরও অর্ডার করব।',
                    'is_approved'          => true,
                    'is_verified_purchase' => true,
                ]
            );
        }

        $this->command->info('Car & Bike Gadgets seeded successfully!');
    }
}
