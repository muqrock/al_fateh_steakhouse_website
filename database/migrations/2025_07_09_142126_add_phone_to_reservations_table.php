<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (! Schema::hasTable('reservations')) {
            return;
        }

        Schema::table('reservations', function (Blueprint $table) {
            if (! Schema::hasColumn('reservations', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
        });
    }

    public function down()
    {
        if (! Schema::hasTable('reservations')) {
            return;
        }

        Schema::table('reservations', function (Blueprint $table) {
            if (Schema::hasColumn('reservations', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
};
