<?php

namespace App\Services\SubjectArea;

use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataTable
{
    public function create(DataDetailFormRequest $request): void
    {
        Schema::create($request->tableName, function (Blueprint $table) use ($request) {
            $this->addPrimaryKey($table);
            $this->addDateFields($table, $request);
            $this->addDateTimeFields($table, $request);
            $this->addDimensionFields($table, $request);
            $this->addMeasureFields($table, $request);
            $this->addTextFieldFields($table, $request);
            $this->addRelationFields($table, $request);
            $this->addAuditFields($table);
        });
    }

    private function addPrimaryKey(Blueprint $table): void
    {
        $table->id();
    }

    private function addDateFields(Blueprint $table, DataDetailFormRequest $request): void
    {
        if ($request->dates === null) {
            return;
        }

        foreach ($request->dates as $date) {
            $table->date($date->column)
                ->nullable()
                ->index();
        }
    }

    private function addDateTimeFields(Blueprint $table, DataDetailFormRequest $request) : void {
        if($request->datetimes === null) {
            return;
        }

        foreach($request->datetimes as $datetime) {
            $table->dateTime($datetime->column)->nullable()->index();
        }
    }

    private function addDimensionFields(Blueprint $table, DataDetailFormRequest $request): void
    {
        if ($request->dimensions === null) {
            return;
        }

        foreach ($request->dimensions as $dimension) {
            $table->foreignId($dimension->column)
                ->nullable()
                ->constrained('meta_data');
        }
    }

    private function addMeasureFields(Blueprint $table, DataDetailFormRequest $request): void
    {
        if ($request->measures === null) {
            return;
        }

        foreach ($request->measures as $measure) {
            $table->double($measure->column)->nullable();

            if ($this->hasUnitField($measure)) {
                $table->string($measure->unitColumn)->nullable();
            }
        }
    }

    private function hasUnitField($measure): bool
    {
        return $measure->unitColumn !== null && $measure->unitFieldName !== null;
    }

    private function addTextFieldFields(Blueprint $table, DataDetailFormRequest $request): void
    {
        if ($request->texts === null) {
            return;
        }

        foreach ($request->texts as $text) {
            $this->addTextField($table, $text);
        }
    }

    private function addTextField(Blueprint $table, $text): void
    {
        if ($text->isLongText) {
            $table->longText($text->column)->nullable();
        } else {
            $table->string($text->column)->nullable();
        }
    }

    private function addRelationFields(Blueprint $table, DataDetailFormRequest $request): void
    {
        if ($request->relations === null) {
            return;
        }

        foreach ($request->relations as $relation) {
            $this->addRelationField($table, $relation);
        }
    }

    private function addRelationField(Blueprint $table, $relation): void
    {
        $relatedTable = DataDetail::find($relation->relatedTableId);

        if ($relatedTable === null) {
            return;
        }

        $table->unsignedBigInteger($relation->column)
            ->nullable()
            ->index();
    }

    private function addAuditFields(Blueprint $table): void
    {
        $table->unsignedBigInteger('created_by')->nullable();
        $table->unsignedBigInteger('updated_by')->nullable();
        $table->unsignedBigInteger('deleted_by')->nullable();
        $table->softDeletes();
        $table->timestamps();
    }
}
