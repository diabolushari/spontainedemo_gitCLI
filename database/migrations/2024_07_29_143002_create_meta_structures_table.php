<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meta_structures', function (Blueprint $table) {
            $table->id();
            $table->string('structure_name');
            $table->text('description')->nullable();
            $table->softDeletes();
            $table->timestamps(); //
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meta_structures');
    }
};
