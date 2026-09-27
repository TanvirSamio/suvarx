<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_spend',
        'max_discount',
        'usage_limit',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_spend' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'expires_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function isValidForSubtotal(float $subtotal): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        if ($this->min_spend && $subtotal < $this->min_spend) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if (!$this->isValidForSubtotal($subtotal)) {
            return 0;
        }

        if ($this->type === 'percentage') {
            $discount = ($subtotal * $this->value) / 100;
            if ($this->max_discount && $discount > $this->max_discount) {
                return (float)$this->max_discount;
            }
            return round($discount, 2);
        }

        return min((float)$this->value, $subtotal);
    }
}
