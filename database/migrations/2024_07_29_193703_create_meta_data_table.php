<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meta_data', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('meta_structure_id')->constrained('meta_structures');
            $table->softDeletes();
            $table->timestamps(); //
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meta_data');
    }
};
