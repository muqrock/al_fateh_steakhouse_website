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
            if (! Schema::hasColumn('reviews', 'admin_reply')) {
                $table->text('admin_reply')->nullable();
            }
            if (! Schema::hasColumn('reviews', 'admin_id')) {
                $table->unsignedBigInteger('admin_id')->nullable();
            }
            if (! Schema::hasColumn('reviews', 'admin_replied_at')) {
                $table->timestamp('admin_replied_at')->nullable();
            }

            // Add foreign key if column exists and table exists
            if (Schema::hasColumn('reviews', 'admin_id') && Schema::hasTable('users')) {
                $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
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
            if (Schema::hasColumn('reviews', 'admin_id')) {
                $table->dropForeign(['admin_id']);
            }
            $table->dropColumn(['admin_reply', 'admin_id', 'admin_replied_at']);
        });
    }
};
