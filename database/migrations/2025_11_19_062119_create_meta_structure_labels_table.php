<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meta_structure_labels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('structure_id')->constrained('meta_structures');
            $table->foreignId('data_classification_property_id')->constrained('data_classification_properties');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_structure_labels');
    }
};
