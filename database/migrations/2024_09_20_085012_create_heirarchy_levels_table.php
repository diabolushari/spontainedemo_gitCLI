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
        Schema::create('meta_hierarchy_level_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meta_hierarchy_id')
                ->constrained('meta_hierarchies');
            $table->unsignedBigInteger('level');
            $table->foreignId('meta_structure_id')
                ->constrained('meta_structures');
            $table->unique(['meta_hierarchy_id', 'level']);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_hierarchy_level_infos');
    }
};
