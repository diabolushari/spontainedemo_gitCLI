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
        Schema::create('subset_group_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('subset_group_id')
                ->constrained('subset_groups');
            $table->unsignedInteger('item_number');
            $table->foreignId('subset_detail_id')
                ->constrained('subset_details');

            $table->softDeletes();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subset_group_items');
    }
};
