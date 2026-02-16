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
        Schema::table('meta_hierarchies', function (Blueprint $table) {
            $table->string('default_heirarchy')->nullable();
        });

        Schema::table('subset_details', function (Blueprint $table) {
            $table->foreignId('heirarchy')
                ->nullable()
                ->constrained('meta_hierarchies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meta_hierarchies', function (Blueprint $table) {
            $table->dropColumn('default_heirarchy');
        });

        Schema::table('subset_details', function (Blueprint $table) {
            $table->dropColumn('heirarchy');
        });
    }
};
