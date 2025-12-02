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
        Schema::create('nav_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_group_id')->constrained()->onDelete('cascade');
            $table->string('item_label');
            $table->string('item_url');
            $table->string('item_icon');
            $table->integer('item_pos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nav_items');
    }
};
