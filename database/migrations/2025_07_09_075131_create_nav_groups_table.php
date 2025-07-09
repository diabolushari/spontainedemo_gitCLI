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
        Schema::create('nav_groups', function (Blueprint $table) {
            $table->id();
            $table->string('nav_type');
            $table->string('group_label');
            $table->string('group_url');
            $table->string('group_icon');
            $table->string('group_pos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nav_groups');
    }
};
