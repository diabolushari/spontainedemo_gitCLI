<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\ReferenceData\ReferenceData;
use App\Models\SubjectArea\SubjectArea;
use App\Services\DataTable\QueryDataTable;
use App\Services\DataTable\SetupDataTable;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
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
        SetupDataTable $setupDataTable
    ): RedirectResponse {

        try {
            $result = $setupDataTable->setup($request);
        } catch (Exception $e) {

            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        if ($result->error) {

            return back()->with([
                'error' => $result->message,
            ]);
        }

        return redirect()
            ->route('data-detail.show', $result->message);
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
            ->with('lastStatus', 'loaderQuery', 'latest')
            ->get();

        return Inertia::render('DataDetail/DataDetailShow', [
            'detail' => $dataDetail,
            'dataTableItems' => $dataTable,
            'jobs' => $jobs,
            'tab' => $request->input('tab', 'data'),
        ]);
    }

    public function destroy(DataDetail $dataDetail): RedirectResponse
    {

        try {
            $dataDetail->delete();
        } catch (Exception $exception) {
            Schema::drop($dataDetail->table_name);

            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()
            ->route('data-detail.show', $dataDetail->id)
            ->with([
                'message' => "Data Detail $dataDetail->name deleted successfully.",
            ]);
    }
}
