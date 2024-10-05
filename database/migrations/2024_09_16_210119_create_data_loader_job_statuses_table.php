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
        Schema::create('loader_job_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loader_job_id')
                ->constrained('loader_jobs');
            $table->dateTime('executed_at');
            $table->dateTime('completed_at')->nullable();
            $table->boolean('is_successful')->default(false);
            $table->longText('error_message')->nullable();
            $table->unsignedInteger('total_records')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loader_job_statuses');
    }
};
