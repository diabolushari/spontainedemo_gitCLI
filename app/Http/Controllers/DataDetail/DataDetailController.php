<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\ReferenceData\ReferenceData;
use App\Models\SubjectArea\SubjectArea;
use App\Services\DataTable\QueryDataTable;
use Exception;
use Illuminate\Http\RedirectResponse;
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

        $subjectAreas = SubjectArea::select(['id', 'name'])
            ->get();

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailCreate', [
            'subjectAreas' => $subjectAreas,
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
        DataDetailFormRequest $request
    ): RedirectResponse {
        try {
            $record = DataDetail::create([
                ...$request->all(),
                'created_by' => auth()->id(),
            ]);
        } catch (Exception $e) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

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

    public function show(DataDetail $dataDetail, QueryDataTable $queryDataTable): RedirectResponse|Response
    {
        $dataDetail->load('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea');
        if (
            $dataDetail->dateFields->count() === 0
            && $dataDetail->dimensionFields->count() === 0
            && $dataDetail->measureFields->count() === 0
        ) {
            return redirect()
                ->route('data-detail-fields-info.create', [
                    'detail_id' => $dataDetail->id,
                ]);
        }

        $dataTable = $queryDataTable->query($dataDetail->subjectArea->table_name ?? '', $dataDetail->id)->get();

        return Inertia::render('DataDetail/DataDetailShow', [
            'detail' => $dataDetail,
            'dataTableItems' => $dataTable,
        ]);
    }
}
