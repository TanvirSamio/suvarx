<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_postal')->nullable();
            $table->text('shipping_notes')->nullable();
            
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            
            $table->string('coupon_code')->nullable();
            $table->string('shipping_method')->default('Standard Delivery');
            $table->string('payment_method')->default('cash_on_delivery'); // cash_on_delivery, card, mobile_banking
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->string('order_status')->default('pending'); // pending, processing, shipped, delivered, cancelled
            
            $table->string('tracking_number')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
