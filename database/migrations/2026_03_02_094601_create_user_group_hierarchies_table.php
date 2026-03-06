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
        Schema::create('user_group_hierarchies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_group_id')
                ->constrained('user_groups')
                ->cascadeOnDelete();
            $table->foreignId('meta_hierarchy_item_id')
                ->nullable()
                ->constrained('meta_hierarchy_items')
                ->nullOnDelete();
            $table->text('hierarchy_connection')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_group_hierarchies');
    }
};
