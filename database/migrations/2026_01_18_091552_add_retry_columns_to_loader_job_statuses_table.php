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
        Schema::table('loader_job_statuses', function (Blueprint $table) {
            $table->boolean('is_retry')->default(false)->after('error_message');
            $table->integer('retry_attempt')->default(0)->after('is_retry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loader_job_statuses', function (Blueprint $table) {
            $table->dropColumn(['is_retry', 'retry_attempt']);
        });
    }
};
