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
        Schema::create('subset_detail_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subset_detail_id')
                ->constrained('subset_details');
            $table->foreignId('field_id')
                ->constrained('data_table_dates');
            $table->string('subset_field_name');
            $table->string('subset_column');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('use_dynamic_date')->default(false);
            $table->boolean('use_last_found_data')->default(true);
            $table->string('dynamic_start_type')->nullable();
            $table->string('dynamic_end_type')->nullable();
            $table->integer('dynamic_start_offset')->nullable();
            $table->string('dynamic_start_unit')->nullable();
            $table->integer('dynamic_end_offset')->nullable();
            $table->string('dynamic_end_unit')->nullable();
            $table->string('date_field_expression')->nullable();
            $table->text('description')->nullable();
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
        Schema::dropIfExists('subset_detail_dates');
    }
};
