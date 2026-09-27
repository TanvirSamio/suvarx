<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'highlight_text',
        'image_url',
        'button_text',
        'button_url',
        'type',
        'is_active',
        'sort_order',
        'media_type',
        'bg_color',
        'bg_gradient',
        'bg_image_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
