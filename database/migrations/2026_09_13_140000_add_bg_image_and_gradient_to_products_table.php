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
            if (!Schema::hasColumn('products', 'bg_type')) {
                $table->string('bg_type')->nullable()->default('gradient')->after('thumbnail');
            }
            if (!Schema::hasColumn('products', 'bg_image')) {
                $table->string('bg_image')->nullable()->after('bg_type');
            }
            if (!Schema::hasColumn('products', 'bg_gradient')) {
                $table->text('bg_gradient')->nullable()->after('bg_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['bg_type', 'bg_image', 'bg_gradient']);
        });
    }
};
