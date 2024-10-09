<?php

namespace App\Services\SubjectArea;

use App\Http\Requests\DataDetail\DataDetailFormRequest;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataTable
{
    public function create(
        DataDetailFormRequest $request
    ): void {
        Schema::create($request->tableName, function (Blueprint $table) use ($request) {
            $table->id();

            foreach ($request->dates as $date) {
                $table->date($date->column)->nullable()
                    ->index();
            }

            foreach ($request->dimensions as $dimension) {
                $table->foreignId($dimension->column)
                    ->nullable()
                    ->constrained('meta_data');
            }

            foreach ($request->measures as $measure) {
                $table->double($measure->column)->nullable();
                if ($measure->unitColumn != null && $measure->unitFieldName != null) {
                    $table->string($measure->unitColumn)->nullable();
                }
            }

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }
}
