<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subset\SubsetFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use Exception;
use Illuminate\Support\Facades\DB;

class SubsetStoreController extends Controller
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

    public function __invoke(DataDetail $dataDetail, SubsetFormRequest $request)
    {
        DB::beginTransaction();

        $user = request()->user()->id;

        try {
            $record = SubsetDetail::create([
                'name' => $request->name,
                'description' => $request->description,
                'data_detail_id' => $dataDetail->id,
                'group_data' => $request->groupData,
                'created_by' => $user,
                'updated_by' => $user,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with([
                    'error' => ExceptionMessage::getMessage($e),
                ]);
        }

        $dates = array_map(function ($date) use ($record, $user) {
            return [
                'subset_detail_id' => $record->id,
                'created_by' => $user,
                'updated_by' => $user,
                ...$date->toArray(),
            ];
        }, $request->dates);

        $dimensions = array_map(function ($dimension) use ($record, $user) {
            return [
                'subset_detail_id' => $record->id,
                'created_by' => $user,
                'updated_by' => $user,
                'filters' => null,
                ...$dimension->toArray(),
            ];
        }, $request->dimensions);

        $measures = array_map(function ($measure) use ($record, $user) {
            return [
                'subset_detail_id' => $record->id,
                'created_by' => $user,
                'updated_by' => $user,
                ...$measure->toArray(),
            ];
        }, $request->measures);

        try {
            SubsetDetailDate::insert($dates);
            SubsetDetailDimension::insert($dimensions);
            SubsetDetailMeasure::insert($measures);
        } catch (Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with([
                    'error' => ExceptionMessage::getMessage($e),
                ]);
        }

        DB::commit();

        return redirect()
            ->route('data-detail.show', [
                'dataDetail' => $dataDetail->id,
                'tab' => 'subset',
            ])
            ->with([
                'message' => 'Subset created successfully',
            ]);

    }
}
