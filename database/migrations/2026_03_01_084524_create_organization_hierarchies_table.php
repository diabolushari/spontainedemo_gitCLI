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

        Schema::create('organization_hierarchies', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organization_id')
                ->constrained('organizations');

            $table->foreignId('meta_hierarchy_item_id')
                ->nullable()
                ->constrained('meta_hierarchy_items');

            $table->text('hierarchy_connection')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('organizations', function (Blueprint $table) {

            $table->dropForeign(['meta_hierarchy_item_id']);

            $table->dropColumn([
                'meta_hierarchy_item_id',
                'hierarchy_connection',
                'objectives',
            ]);

            // $table->foreignId('hierarchy_id')
            //     ->nullable()
            //     ->constrained('organization_hierarchies')
            //     ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        // Schema::table('organizations', function (Blueprint $table) {
        //     $table->dropForeign(['hierarchy_id']);
        //     $table->dropColumn('hierarchy_id');
        // });

        Schema::table('organizations', function (Blueprint $table) {
            $table->json('objectives')->nullable();

            $table->foreignId('meta_hierarchy_item_id')
                ->nullable()
                ->constrained('meta_hierarchy_items')
                ->nullOnDelete();

            $table->text('hierarchy_connection')->nullable();
        });

        Schema::dropIfExists('organization_hierarchies');
    }
};
