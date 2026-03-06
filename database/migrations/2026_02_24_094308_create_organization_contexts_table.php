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
        Schema::create('organization_context_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations');
            $table->text('context');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('organizations', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('name');
            $table->string('primary_colour')->nullable();
            $table->string('secondary_colour')->nullable();
            $table->string('tertiary_colour')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_context_histories');
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn('logo');
            $table->dropColumn('primary_colour');
            $table->dropColumn('secondary_colour');
            $table->dropColumn('tertiary_colour');
        });
    }
};
