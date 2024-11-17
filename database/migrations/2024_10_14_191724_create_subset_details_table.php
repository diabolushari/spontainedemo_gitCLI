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
        Schema::create('subset_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('data_detail_id')
                ->nullable()
                ->constrained('data_details');
            $table->boolean('group_data')->default(0);
            $table->unsignedInteger('rows_to_fetch')->nullable();
            $table->string('type')->default('composite_subset');
            $table->softDeletes();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->timestamps();
        });

        Schema::table('subset_details', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->string('type')->default('composite_subset');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subset_details');
    }
};
