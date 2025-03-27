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

            if ($request->dates != null) {
                foreach ($request->dates as $date) {
                    $table->date($date->column)->nullable()
                        ->index();
                }
            }
            if ($request->dimensions != null) {
                foreach ($request->dimensions as $dimension) {
                    $table->foreignId($dimension->column)
                        ->nullable()
                        ->constrained('meta_data');
                }
            }

            if ($request->measures != null) {
                foreach ($request->measures as $measure) {
                    $table->double($measure->column)->nullable();
                    if ($measure->unitColumn != null && $measure->unitFieldName != null) {
                        $table->string($measure->unitColumn)->nullable();
                    }
                }
            }

            if ($request->texts != null) {
                foreach ($request->texts as $text) {
                    if ($text->isLongText) {
                        $table->longText($text->column)->nullable();
                    } else {
                        $table->string($text->column)->nullable();
                    }
                }
            }

            if ($request->relations != null) {
                foreach ($request->relations as $relation) {
                    $table->foreignId($relation->column)
                        ->nullable()
                        ->constrained('data_details');
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
