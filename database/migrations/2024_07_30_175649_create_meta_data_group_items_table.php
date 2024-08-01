<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meta_group_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meta_group_id')
                ->constrained('meta_groups');
            $table->foreignId('meta_data_id')
                ->constrained('meta_data');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meta_group_items');
    }
};
