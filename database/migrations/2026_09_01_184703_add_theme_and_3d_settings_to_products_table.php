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
            $table->string('theme_color_mood')->nullable();
            $table->string('theme_light_mood')->nullable();
            $table->string('theme_watermark')->nullable();
            $table->decimal('model_scale', 8, 2)->default(2.00);
            $table->decimal('model_pos_x', 8, 2)->default(0);
            $table->decimal('model_pos_y', 8, 2)->default(0);
            $table->decimal('model_pos_z', 8, 2)->default(0);
            $table->decimal('model_rot_x', 8, 2)->default(0);
            $table->decimal('model_rot_y', 8, 2)->default(0);
            $table->decimal('model_rot_z', 8, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
