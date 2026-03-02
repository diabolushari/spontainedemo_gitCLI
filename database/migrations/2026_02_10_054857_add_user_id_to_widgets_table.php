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
        Schema::table('widgets', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
        });

        // Backfill user_id from widget_collections
        DB::table('widgets')
            ->join('widget_collections', 'widgets.collection_id', '=', 'widget_collections.id')
            ->whereNotNull('widget_collections.user_id')
            ->update([
                'widgets.user_id' => DB::raw('`widget_collections`.`user_id`')
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('widgets', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
