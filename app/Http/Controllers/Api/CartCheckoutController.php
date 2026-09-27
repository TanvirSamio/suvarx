<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;

class CartCheckoutController extends Controller
{
    /**
     * Validate and calculate coupon discount
     */
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->code));
        $subtotal = (float)$request->subtotal;

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coupon code. Please try another.',
            ], 422);
        }

        if (!$coupon->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon is no longer active.',
            ], 422);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon has expired.',
            ], 422);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'success' => false,
                'message' => 'This coupon has reached its maximum usage limit.',
            ], 422);
        }

        if ($coupon->min_spend && $subtotal < (float)$coupon->min_spend) {
            return response()->json([
                'success' => false,
                'message' => "Minimum purchase of $" . number_format($coupon->min_spend, 2) . " required for this coupon.",
            ], 422);
        }

        $discount = $coupon->calculateDiscount($subtotal);

        return response()->json([
            'success' => true,
            'message' => "Coupon '{$coupon->code}' applied successfully!",
            'coupon' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount_amount' => $discount,
            ],
        ]);
    }

    /**
     * Place order and calculate breakdown
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'required|email|max:100',
            'customer_phone' => 'required|string|max:30',
            'shipping_address' => 'required|string|max:300',
            'shipping_city' => 'nullable|string|max:100',
            'shipping_postal' => 'nullable|string|max:20',
            'shipping_notes' => 'nullable|string|max:500',
            'shipping_method' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'coupon_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $subtotal = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Verify price
                $unitPrice = (float)$product->price;
                $quantity = (int)$item['quantity'];
                $lineTotal = $unitPrice * $quantity;
                $subtotal += $lineTotal;

                // Inventory decrement if available
                if ($product->stock_quantity >= $quantity) {
                    $product->decrement('stock_quantity', $quantity);
                }

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'product_sku' => $product->sku,
                    'product_thumbnail' => $product->thumbnail,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'total_price' => $lineTotal,
                    'options' => $item['options'] ?? null,
                ];
            }

            // Calculate Discount
            $discountAmount = 0;
            $appliedCoupon = null;
            if ($request->filled('coupon_code')) {
                $coupon = Coupon::where('code', strtoupper(trim($request->coupon_code)))->first();
                if ($coupon && $coupon->isValidForSubtotal($subtotal)) {
                    $discountAmount = $coupon->calculateDiscount($subtotal);
                    $coupon->increment('used_count');
                    $appliedCoupon = $coupon->code;
                }
            }

            // Shipping Fee
            $freeShippingMin = (float)Setting::get('free_shipping_min', 99);
            $standardShippingFee = (float)Setting::get('shipping_standard_fee', 9.99);
            $expressShippingFee = (float)Setting::get('shipping_express_fee', 19.99);

            $shippingMethod = $request->get('shipping_method', 'Standard Delivery');
            $shippingFee = $standardShippingFee;

            if (str_contains(strtolower($shippingMethod), 'express')) {
                $shippingFee = $expressShippingFee;
            } elseif ($subtotal >= $freeShippingMin) {
                $shippingFee = 0.00;
                $shippingMethod = 'Free Standard Delivery';
            }

            // Tax (5% default)
            $taxRatePercent = (float)Setting::get('tax_rate_percent', 5.0);
            $taxableSubtotal = max(0, $subtotal - $discountAmount);
            $taxAmount = round(($taxableSubtotal * $taxRatePercent) / 100, 2);

            $totalAmount = round($taxableSubtotal + $shippingFee + $taxAmount, 2);

            // Generate unique Order Number
            $orderNumber = 'SVX-' . strtoupper(substr(uniqid(), -6));

            $paymentMethod = $request->payment_method ?: 'cash_on_delivery';

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => auth('sanctum')->id() ?? null,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city ?: 'Dhaka, Bangladesh',
                'shipping_postal' => $request->shipping_postal,
                'shipping_notes' => $request->shipping_notes,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'shipping_fee' => $shippingFee,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'coupon_code' => $appliedCoupon,
                'shipping_method' => $shippingMethod,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
                'order_status' => 'pending',
                'tracking_number' => 'TRK-' . strtoupper(substr(md5($orderNumber), 0, 10)),
            ]);

            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'order' => $order->load('items'),
            ], 201);
        });
    }

    /**
     * Track order by Order Number
     */
    public function trackOrder(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        $orderNumber = trim($request->order_number);
        $order = Order::where('order_number', $orderNumber)
            ->orWhere('tracking_number', $orderNumber)
            ->with(['items', 'user'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'No order found with the provided order number or tracking code.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }
}
