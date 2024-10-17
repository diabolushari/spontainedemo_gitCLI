<?php

namespace App\Services\DataTable;

use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
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
                'message' => ExceptionMessage::getMessage($exception),
            ]);
        }

        try {
            $record = DataDetail::create([
                ...$formRequest->all(),
                'created_by' => auth()->id(),
            ]);
        } catch (Exception $e) {
            Schema::dropIfExists($formRequest->tableName);

            return OperationResult::from([
                'error' => true,
                'message' => ExceptionMessage::getMessage($e),
            ]);
        }

        $dateField = $this->initDates($record, $formRequest);
        $dimensionField = $this->initDimensions($record, $formRequest);
        $measureField = $this->initMeasures($record, $formRequest);

        try {
            DataTableDate::insert($dateField);
            DataTableDimension::insert($dimensionField);
            DataTableMeasure::insert($measureField);
        } catch (Exception $exception) {
            Schema::dropIfExists($record->table_name);

            return OperationResult::from([
                'error' => true,
                'message' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return OperationResult::from([
            'error' => false,
            'message' => ''.$record->id,
        ]);
    }

    /**
     * @return array{
     *     data_detail_id: int,
     *     column: string,
     *     field_name: string,
     *     created_by: int,
     *     updated_by: int,
     *     created_at: string,
     *     updated_at: string,
     * }[]
     */
    private function initDates(DataDetail $dataDetail, DataDetailFormRequest $request): array
    {
        $dateFields = [];
        $createdBy = request()->user()->id;
        $now = now()->toDateString();

        if ($request->dates != null) {
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
        }

        return $dateFields;
    }

    /**
     * @return array{
     *     data_detail_id: int,
     *     column: string,
     *     field_name: string,
     *     meta_structure_id: int,
     *     created_by: int,
     *     updated_by: int,
     *     created_at: string,
     *     updated_at: string,
     * }[]
     */
    private function initDimensions(DataDetail $dataDetail, DataDetailFormRequest $request): array
    {
        $dimensionFields = [];
        $createdBy = request()->user()->id;
        $now = now()->toDateString();

        if ($request->dimensions != null) {
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
        }

        return $dimensionFields;

    }

    /**
     * @return array{
     *     data_detail_id: int,
     *     column: string,
     *     field_name: string,
     *     unit_column: string|null,
     *     unit_field_name: string|null,
     *     created_by: int,
     *     updated_by: int,
     * }[]
     */
    private function initMeasures(DataDetail $dataDetail, DataDetailFormRequest $request): array
    {
        $measureFields = [];
        $createdBy = request()->user()->id;
        $now = now()->toDateString();

        if ($request->measures != null) {
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

        }

        return $measureFields;
    }
}
