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
        if (! Schema::hasTable('reviews')) {
            return;
        }

        Schema::table('reviews', function (Blueprint $table) {
            if (! Schema::hasColumn('reviews', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            }
            if (! Schema::hasColumn('reviews', 'menu_item_id')) {
                $table->foreignId('menu_item_id')->nullable()->constrained()->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('reviews')) {
            return;
        }

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'user_id')) {
                $table->dropForeign(['user_id']);
            }
            if (Schema::hasColumn('reviews', 'menu_item_id')) {
                $table->dropForeign(['menu_item_id']);
            }
            $table->dropColumn(['user_id', 'menu_item_id']);
        });
    }
};
