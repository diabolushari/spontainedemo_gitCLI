<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataTableFieldRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DataTableFieldsInfoController extends Controller
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

    public function create(Request $request): Response|RedirectResponse
    {
        /** @var DataDetail $detail */
        $detail = DataDetail::where('id', $request->detail_id)
            ->withCount('dateFields', 'dimensionFields', 'measureFields')
            ->firstOrFail();

        // if any field is already added, redirect to show page
        if ($detail->date_fields_count > 0 || $detail->dimension_fields_count > 0 || $detail->measure_fields_count > 0) {
            return redirect()
                ->route('data-detail.show', $request->detail_id);
        }

        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        return Inertia::render('DataTableFieldInfo/InitDataTableInfoPage', [
            'detail' => $detail,
            'structures' => $structures,
        ]);
    }

    public function store(DataTableFieldRequest $request): RedirectResponse
    {

        $detail = DataDetail::where('id', $request->detailId)
            ->withCount('dateFields', 'dimensionFields', 'measureFields')
            ->first();

        if ($detail == null) {
            return redirect()
                ->route('data-detail.show', $request->detailId)
                ->with([
                    'error' => 'Data Detail not found',
                ]);
        }

        // if any field is already added, redirect to show page
        if ($detail->date_fields_count > 0 || $detail->dimension_fields_count > 0 || $detail->measure_fields_count > 0) {
            return redirect()
                ->route('data-detail.show', $request->detailId)
                ->with([
                    'error' => 'Data Table Fields Info already added',
                ]);
        }

        $createdBy = request()->user()->id;

        $dateFields = [];
        $dimensionFields = [];
        $measureFields = [];
        $now = now()->toDateString();

        if ($request->dates != null) {
            foreach ($request->dates as $measure) {
                $dateFields[] = [
                    'data_detail_id' => $request->detailId,
                    'column' => $measure->column,
                    'field_name' => $measure->fieldName,
                    'created_by' => $createdBy,
                    'updated_by' => $createdBy,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if ($request->dimensions != null) {
            foreach ($request->dimensions as $measure) {
                $dimensionFields[] = [
                    'data_detail_id' => $request->detailId,
                    'column' => $measure->column,
                    'field_name' => $measure->fieldName,
                    'meta_structure_id' => $measure->metaStructureId,
                    'created_by' => $createdBy,
                    'updated_by' => $createdBy,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if ($request->measures != null) {
            foreach ($request->measures as $measure) {
                $measureFields[] = [
                    'data_detail_id' => $request->detailId,
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

        DB::beginTransaction();
        try {
            DataTableDate::insert($dateFields);
            DataTableDimension::insert($dimensionFields);
            DataTableMeasure::insert($measureFields);
        } catch (Exception $e) {
            DB::rollBack();

            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        DB::commit();

        return redirect()->route('data-detail.show', $request->detailId)
            ->with([
                'message' => 'Data Table Fields Info has been created successfully',
            ]);

    }
}
