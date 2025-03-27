<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_table_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_detail_id')->constrained('data_details');
            $table->string('column');
            $table->string('field_name');
            $table->foreignId('related_table_id')->constrained('data_details');
            $table->timestamps();
            $table->softDeletes();
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_table_relations');
    }
};
