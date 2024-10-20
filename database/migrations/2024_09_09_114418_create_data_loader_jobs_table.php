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
        Schema::create('loader_jobs', function (Blueprint $table) {
            $table->id();

            //fields
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('cron_type');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('schedule_time')->nullable(); // required for everyone except type hourly
            $table->string('day_of_week')->nullable(); // required for type weekly
            $table->unsignedBigInteger('day_of_month')->nullable(); // required for type monthly, yearly
            $table->unsignedBigInteger('month_of_year')->nullable(); // required for type yearly

            $table->boolean('delete_existing_data')->default(false);

            $table->foreignId('query_id')
                ->constrained('loader_queries');

            $table->foreignId('data_detail_id')
                ->constrained('data_details');

            $table->softDeletes();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loader_jobs');
    }
};
