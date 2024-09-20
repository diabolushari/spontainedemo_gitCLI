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
        Schema::create('heirarchy_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meta_hierarchy_id')
                ->constrained('meta_hierarchies');
            $table->string('level');
            $table->string('heirarchy_name');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heirarchy_levels');
    }
};
