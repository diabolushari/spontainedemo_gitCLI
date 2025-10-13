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
        Schema::table('subset_details', function (Blueprint $table) {
            $table->boolean('use_for_training_ai')->default(false);
            $table->text('proactive_insight_instructions')->nullable();
            $table->text('visualization_instructions')->nullable();
        });

        Schema::table('subset_detail_dimensions', function (Blueprint $table) {
            $table->foreignId('hierarchy_id')
                ->nullable()
                ->constrained('meta_hierarchies');
            $table->text('description')->nullable();
        });

        // description column already exists in subset_detail_measures table
        Schema::table('subset_detail_measures', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->text('description')->nullable();
        });

        // description column already exists in subset_detail_dates table as text
        // Schema::table('subset_detail_dates', function (Blueprint $table) {
        //     $table->text('description')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('subset_details', function (Blueprint $table) {
            $table->dropColumn('use_for_training_ai');
            $table->dropColumn('proactive_insight_instructions');
            $table->dropColumn('visualization_instructions');
        });

        Schema::table('subset_detail_dimensions', function (Blueprint $table) {
            $table->dropForeign('subset_detail_dimensions_hierarchy_id_foreign');
            $table->dropIndex('subset_detail_dimensions_hierarchy_id_foreign');
            $table->dropColumn('hierarchy_id');
            $table->dropColumn('description');
        });

        // description column belongs to original subset_detail_dates table creation
        // Schema::table('subset_detail_dates', function (Blueprint $table) {
        //     $table->dropColumn('description');
        // });

        // description column belongs to original subset_detail_measures table creation
        Schema::table('subset_detail_measures', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->string('description')->nullable();
        });
    }
};
