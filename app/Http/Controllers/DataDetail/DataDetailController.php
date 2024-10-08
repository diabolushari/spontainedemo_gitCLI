<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\ReferenceData\ReferenceData;
use App\Models\SubjectArea\SubjectArea;
use App\Services\DataTable\QueryDataTable;
use App\Services\SubjectArea\CreateDataTable;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DataDetailController extends Controller
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function index(): Response
    {

        $details = DataDetail::paginate(20)
            ->withQueryString();

        return Inertia::render('DataDetail/DataDetailIndex', [
            'details' => $details,
        ]);
    }

    public function create(): Response
    {

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailCreate', [
            'types' => $referenceData,
        ]);
    }

    public function edit(DataDetail $dataDetail): Response
    {

        $subjectAreas = SubjectArea::select(['id', 'name'])
            ->get();

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailEdit', [
            'subjectAreas' => $subjectAreas,
            'types' => $referenceData,
            'dataDetail' => $dataDetail,
        ]);
    }

    public function store(
        DataDetailFormRequest $request,
        CreateDataTable $createDataTable
    ): RedirectResponse {

        try {
            $createDataTable->create($request);
        } catch (Exception $exception) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        DB::beginTransaction();
        try {
            $record = DataDetail::create([
                ...$request->all(),
                'created_by' => auth()->id(),
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
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
                    'data_detail_id' => $record->id,
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
                    'data_detail_id' => $record->id,
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
                    'data_detail_id' => $record->id,
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

        return redirect()
            ->route('data-detail.show', $record->id);
    }

    public function update(
        DataDetail $dataDetail,
        DataDetailFormRequest $request
    ): RedirectResponse {
        try {
            $dataDetail->update([
                ...$request->all(),
                'updated_by' => auth()->id(),
            ]);
        } catch (Exception $e) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()
            ->route('data-detail.show', $dataDetail->id);
    }

    public function show(DataDetail $dataDetail, QueryDataTable $queryDataTable, Request $request): RedirectResponse|Response
    {
        $dataDetail->load('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea');

        $dataTable = $queryDataTable->query($dataDetail)
            ->paginate(50)
            ->withQueryString();

        $jobs = DataLoaderJob::where('data_detail_id', $dataDetail->id)
            ->with('lastStatus')
            ->get();

        return Inertia::render('DataDetail/DataDetailShow', [
            'detail' => $dataDetail,
            'dataTableItems' => $dataTable,
            'jobs' => $jobs,
            'tab' => $request->input('tab', 'data'),
        ]);
    }
}
