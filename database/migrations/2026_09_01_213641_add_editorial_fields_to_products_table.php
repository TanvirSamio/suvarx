<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('fabric')->nullable();
            $table->string('gsm')->nullable();
            $table->string('fit')->nullable();
            $table->string('neck')->nullable();
            $table->string('sleeve')->nullable();
            $table->string('care_instructions')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_desc')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('text_color')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'fabric',
                'gsm',
                'fit',
                'neck',
                'sleeve',
                'care_instructions',
                'seo_title',
                'seo_desc',
                'bg_color',
                'text_color'
            ]);
        });
    }
};
