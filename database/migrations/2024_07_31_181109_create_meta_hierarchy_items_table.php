<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meta_hierarchy_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meta_hierarchy_id')
                ->constrained('meta_hierarchies');
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('meta_hierarchy_items');
            $table->foreignId('meta_data_id')
                ->constrained('meta_data');
            $table->unsignedBigInteger('level')
                ->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meta_hierarchy_items');
    }
};
