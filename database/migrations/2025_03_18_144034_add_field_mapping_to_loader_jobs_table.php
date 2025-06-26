<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->json('field_mapping')->nullable()->after('api_id');
        });
    }

    public function down(): void
    {
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->dropColumn('field_mapping');
        });
    }
};
