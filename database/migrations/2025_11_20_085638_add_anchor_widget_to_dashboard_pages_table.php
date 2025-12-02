<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('dashboard_pages', function (Blueprint $table) {
            $table->unsignedBigInteger('anchor_widget')->nullable()->after('published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashboard_pages', function (Blueprint $table) {
            $table->dropColumn('anchor_widget');
        });
    }
};
