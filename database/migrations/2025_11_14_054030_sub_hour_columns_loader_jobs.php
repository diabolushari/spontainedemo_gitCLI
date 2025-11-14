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
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->string('schedule_start_time')->nullable();
            $table->integer('sub_hour_interval')->nullable();
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->dropColumn(['schedule_start_time', 'sub_hour_interval']);
        });
    }
};
