<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('dashboardtables', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('url');
        $table->text('description');
        $table->timestamp('published_at');
        $table->timestamps();
        $table->SoftDelete();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboardtables');
    }
};
