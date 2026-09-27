<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'sku',
        'barcode',
        'short_description',
        'description',
        'price',
        'compare_price',
        'cost_price',
        'stock_quantity',
        'low_stock_threshold',
        'thumbnail',
        'model_3d',
        'theme_color_mood',
        'theme_light_mood',
        'theme_watermark',
        'model_scale',
        'model_pos_x',
        'model_pos_y',
        'model_pos_z',
        'model_rot_x',
        'model_rot_y',
        'model_rot_z',
        'gallery',
        'attributes',
        'category_id',
        'brand_id',
        'rating',
        'review_count',
        'is_featured',
        'is_trending',
        'is_new',
        'is_active',
        'fabric',
        'gsm',
        'fit',
        'neck',
        'sleeve',
        'care_instructions',
        'seo_title',
        'seo_desc',
        'bg_color',
        'bg_type',
        'bg_image',
        'bg_gradient',
        'text_color'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'gallery' => 'array',
        'attributes' => 'array',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function allReviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        return null;
    }
}
