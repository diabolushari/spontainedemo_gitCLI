<?php

namespace App\Services\SubjectArea;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataTable
{
    public function create(string $tableName): void
    {
        Schema::create($tableName, function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_detail_id')
                ->constrained('data_details');
            $table->date('date_1')->nullable()
                ->index();
            $table->date('date_2')->nullable()
                ->index();
            $table->date('date_3')->nullable()
                ->index();
            $table->date('date_4')->nullable()
                ->index();
            $table->date('date_5')->nullable()
                ->index();
            $table->foreignId('dim_1')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_2')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_3')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_4')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_5')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_6')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_7')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_8')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_9')
                ->nullable()
                ->constrained('meta_data');
            $table->foreignId('dim_10')
                ->nullable()
                ->constrained('meta_data');
            $table->double('measure_1', 10, 2)->nullable();
            $table->double('measure_2', 10, 2)->nullable();
            $table->double('measure_3', 10, 2)->nullable();
            $table->double('measure_4', 10, 2)->nullable();
            $table->double('measure_5', 10, 2)->nullable();
            $table->double('measure_6', 10, 2)->nullable();
            $table->double('measure_7', 10, 2)->nullable();
            $table->double('measure_8', 10, 2)->nullable();
            $table->string('measure_1_unit')->nullable();
            $table->string('measure_2_unit')->nullable();
            $table->string('measure_3_unit')->nullable();
            $table->string('measure_4_unit')->nullable();
            $table->string('measure_5_unit')->nullable();
            $table->string('measure_6_unit')->nullable();
            $table->string('measure_7_unit')->nullable();
            $table->string('measure_8_unit')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }
}
