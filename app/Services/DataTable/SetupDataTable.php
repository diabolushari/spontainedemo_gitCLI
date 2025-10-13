<?php

namespace App\Services\DataTable;

use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\DataTable\DataTableRelation;
use App\Models\DataTable\DataTableText;
use App\Services\SubjectArea\CreateDataTable;
use Exception;
use Illuminate\Support\Facades\Schema;

readonly class SetupDataTable
{
    public function __construct(
        public readonly CreateDataTable $createDataTable
    ) {}

    public function setup(DataDetailFormRequest $formRequest): OperationResult
    {
        try {
            $this->createDataTable->create($formRequest);
        } catch (Exception $exception) {
            Schema::dropIfExists($formRequest->tableName);

            return OperationResult::from([
                'error' => true,
                'message' => 'on table create: '.ExceptionMessage::getMessage($exception),
            ]);
        }

        try {
            $record = DataDetail::create([
                ...$formRequest->all(),
                'created_by' => request()->user()?->id,
            ]);
        } catch (Exception $e) {
            Schema::dropIfExists($formRequest->tableName);

            return OperationResult::from([
                'error' => true,
                'message' => 'On Detail Create: '.ExceptionMessage::getMessage($e),
            ]);
        }

        try {
            $this->initDates($record, $formRequest);
            $this->initDimensions($record, $formRequest);
            $this->initMeasures($record, $formRequest);
            $this->initTexts($record, $formRequest);
            $this->initRelations($record, $formRequest);
        } catch (Exception $exception) {
            Schema::dropIfExists($record->table_name);

            return OperationResult::from([
                'error' => true,
                'message' => 'here: '.ExceptionMessage::getMessage($exception),
            ]);
        }

        try {
            $this->createLoaderJob($record, $formRequest);
        } catch (Exception $exception) {
            return OperationResult::from([
                'error' => true,
                'message' => 'On Job Create: '.ExceptionMessage::getMessage($exception),
            ]);
        }

        return OperationResult::from([
            'error' => false,
            'message' => ''.$record->id,
        ]);
    }

    private function initDates(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->dates == null) {
            return;
        }

        $dateFields = [];
        $createdBy = request()->user()?->id;
        $now = now()->toDateString();

        foreach ($request->dates as $measure) {
            $dateFields[] = [
                'data_detail_id' => $dataDetail->id,
                'column' => $measure->column,
                'field_name' => $measure->fieldName,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DataTableDate::insert($dateFields);
    }

    private function initDimensions(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->dimensions == null) {
            return;
        }

        $dimensionFields = [];
        $createdBy = request()->user()?->id;
        $now = now()->toDateString();

        foreach ($request->dimensions as $dimension) {
            $dimensionFields[] = [
                'data_detail_id' => $dataDetail->id,
                'column' => $dimension->column,
                'field_name' => $dimension->fieldName,
                'meta_structure_id' => $dimension->metaStructureId,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DataTableDimension::insert($dimensionFields);
    }

    private function initMeasures(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->measures == null) {
            return;
        }

        $measureFields = [];
        $createdBy = request()->user()?->id;
        $now = now()->toDateString();

        foreach ($request->measures as $measure) {
            $measureFields[] = [
                'data_detail_id' => $dataDetail->id,
                'column' => $measure->column,
                'field_name' => $measure->fieldName,
                'unit_column' => $measure->unitColumn,
                'unit_field_name' => $measure->unitFieldName,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DataTableMeasure::insert($measureFields);
    }

    private function initTexts(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->texts == null) {
            return;
        }

        $textFields = [];
        $createdBy = request()->user()?->id;
        $now = now()->toDateString();

        foreach ($request->texts as $text) {
            $textFields[] = [
                'data_detail_id' => $dataDetail->id,
                'column' => $text->column,
                'field_name' => $text->fieldName,
                'is_long_text' => $text->isLongText,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DataTableText::insert($textFields);
    }

    private function initRelations(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->relations == null) {
            return;
        }

        $relationFields = [];
        $createdBy = request()->user()?->id;
        $now = now()->toDateString();

        foreach ($request->relations as $relation) {
            $relationFields[] = [
                'data_detail_id' => $dataDetail->id,
                'column' => $relation->column,
                'field_name' => $relation->fieldName,
                'related_table_id' => $relation->relatedTableId,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DataTableRelation::insert($relationFields);
    }

    private function createLoaderJob(DataDetail $dataDetail, DataDetailFormRequest $request): void
    {
        if ($request->jobName === null || $request->sourceType === null) {
            return;
        }

        DataLoaderJob::create([
            'name' => $request->jobName,
            'description' => $request->jobDescription,
            'cron_type' => $request->cronType,
            'start_date' => $request->startDate,
            'end_date' => $request->endDate,
            'schedule_time' => $request->scheduleTime,
            'day_of_week' => $request->dayOfWeek,
            'month_of_year' => $request->monthOfYear,
            'day_of_month' => $request->dayOfMonth,
            'duplicate_identification_field' => $request->duplicateIdentificationField,
            'delete_existing_data' => $request->deleteExistingData,
            'query_id' => $request->queryId,
            'api_id' => $request->apiId,
            'source_type' => $request->sourceType,
            'data_detail_id' => $dataDetail->id,
            'field_mapping' => $request->fieldMapping,
            'created_by' => request()->user()?->id,
        ]);
    }
}
