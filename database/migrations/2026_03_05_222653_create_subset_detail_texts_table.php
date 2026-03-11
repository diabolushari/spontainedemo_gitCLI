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
        Schema::create('subset_detail_texts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subset_detail_id')
                ->constrained('subset_details');
            $table->foreignId('field_id')
                ->constrained('data_table_texts');
            $table->string('subset_field_name');
            $table->string('subset_column');
            $table->string('sort_order')->nullable();
            $table->softDeletes();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subset_detail_texts');
    }
};
