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
        Schema::table('banners', function (Blueprint $table) {
            if (!Schema::hasColumn('banners', 'bg_color')) {
                $table->string('bg_color')->nullable()->after('media_type');
            }
            if (!Schema::hasColumn('banners', 'bg_gradient')) {
                $table->string('bg_gradient')->nullable()->after('bg_color');
            }
            if (!Schema::hasColumn('banners', 'bg_image_url')) {
                $table->string('bg_image_url')->nullable()->after('bg_gradient');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('banners', 'bg_color')) $columnsToDrop[] = 'bg_color';
            // Keeping bg_gradient since it existed before
            if (Schema::hasColumn('banners', 'bg_image_url')) $columnsToDrop[] = 'bg_image_url';
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
