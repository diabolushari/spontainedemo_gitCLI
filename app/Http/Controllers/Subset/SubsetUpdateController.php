<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subset\SubsetFormRequest;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Models\Subset\SubsetDetailText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Throwable;

class SubsetUpdateController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    /**
     * @throws Throwable
     */
    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetFormRequest $request
    ): RedirectResponse {
        try {
            DB::beginTransaction();

            $subsetDetail->update(
                $request->except('dates', 'dimensions', 'measures', 'texts')->toArray()
            );

            $user = request()->user()?->id;

            // --- Process Dates ---
            $this->processRelatedData(
                $request->dates ?? [],
                $subsetDetail,
                SubsetDetailDate::class,
                'dates',
                $user,
                [
                    'subset_detail_id',
                    'field_id',
                    'subset_field_name',
                    'subset_column',
                    'sort_order',
                    'start_date',
                    'end_date',
                    'use_dynamic_date',
                    'use_last_found_data',
                    'dynamic_start_type',
                    'dynamic_end_type',
                    'dynamic_start_offset',
                    'dynamic_start_unit',
                    'dynamic_end_offset',
                    'dynamic_end_unit',
                    'date_field_expression',
                    'temporal_type',
                    'updated_by',
                ]
            );

            // --- Process Dimensions ---
            $this->processRelatedData(
                $request->dimensions ?? [],
                $subsetDetail,
                SubsetDetailDimension::class,
                'dimensions',
                $user,
                [
                    'subset_detail_id',
                    'field_id',
                    'subset_field_name',
                    'subset_column',
                    'filter_only',
                    'column_expression',
                    'filters',
                    'hierarchy_id',
                    'description',
                    'updated_by',
                    'sort_order',
                ]
            );

            // --- Process Measures ---
            $this->processRelatedData(
                $request->measures ?? [],
                $subsetDetail,
                SubsetDetailMeasure::class,
                'measures',
                $user,
                [
                    'subset_detail_id',
                    'field_id',
                    'subset_field_name',
                    'subset_column',
                    'sort_order',
                    'column',
                    'aggregation',
                    'expression',
                    'weight_field_id',
                    'updated_by',
                ]
            );

            // --- Process Text Fields ---
            $this->processRelatedData(
                $request->texts ?? [],
                $subsetDetail,
                SubsetDetailText::class,
                'texts',
                $user,
                [
                    'subset_detail_id',
                    'field_id',
                    'subset_field_name',
                    'subset_column',
                    'sort_order',
                    'expression',
                    'description',
                    'updated_by',
                ]
            );

            DB::commit();

            return redirect()
                ->route('subset.preview', $subsetDetail->id)
                ->with(['message' => 'Subset updated successfully']);
        } catch (Throwable $e) {
            DB::rollBack();

            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }

    /**
     * Process related data for a subset (Dates, Dimensions, or Measures).
     *
     * @param  array  $data  The array of data from the request.
     * @param  SubsetDetail  $subsetDetail  The parent subset detail model.
     * @param  string  $modelClass  The model class name for the related data.
     * @param  string  $relationName  The name of the relationship on the SubsetDetail model.
     * @param  int|null  $userId  The ID of the current user.
     * @param  array  $upsertColumns  The columns to update in case of an upsert.
     */
    private function processRelatedData(
        array $data,
        SubsetDetail $subsetDetail,
        string $modelClass,
        string $relationName,
        ?int $userId,
        array $upsertColumns
    ): void {
        $itemsToUpdate = [];
        $itemsToCreate = [];
        $idsToKeep = [];

        foreach ($data as $item) {
            $itemArray = $item->toArray();

            if ($relationName === 'dimensions' && isset($itemArray['filters']) && is_array($itemArray['filters'])) {
                $itemArray['filters'] = json_encode($itemArray['filters']);
            }

            $preparedData = [
                'subset_detail_id' => $subsetDetail->id,
                'created_by' => $userId,
                'updated_by' => $userId,
                ...collect($itemArray)->except('id')->toArray(),
            ];

            if ($relationName === 'dates' && !empty($preparedData['field_id'])) {
                $tableDate = \App\Models\DataTable\DataTableDate::find($preparedData['field_id']);
                $preparedData['temporal_type'] = $tableDate?->temporal_type;
            }

            if (!empty($itemArray['id'])) {
                $preparedData['id'] = $itemArray['id'];
                $itemsToUpdate[] = $preparedData;
                $idsToKeep[] = $itemArray['id'];
            } else {
                if ($relationName === 'dimensions' && isset($preparedData['filters'])) {
                    $preparedData['filters'] = json_decode($preparedData['filters'], true);
                }
                $itemsToCreate[] = $preparedData;
            }
        }

        if (!empty($itemsToUpdate)) {
            $modelClass::upsert($itemsToUpdate, ['id'], $upsertColumns);
        }

        foreach ($itemsToCreate as $itemData) {
            $newItem = $modelClass::create($itemData);
            $idsToKeep[] = $newItem->id;
        }

        $subsetDetail->{$relationName}()->whereNotIn('id', $idsToKeep)->delete();
    }
}
