<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\ReferenceData\ReferenceData;
use App\Models\SubjectArea\SubjectArea;
use App\Models\Subset\SubsetDetail;
use App\Services\DataTable\DataTableFilter;
use App\Services\DataTable\DeleteDataTable;
use App\Services\DataTable\QueryDataTable;
use App\Services\DataTable\SetupDataTable;
use Exception;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DataDetailController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function index(Request $request): Response
    {

        $details = DataDetail::when($request->filled('search'), function (Builder $builder) use ($request) {
            $builder->where('name', 'like', '%' . $request->input('search') . '%');
        })->when($request->filled('type'), function (Builder $builder) use ($request) {
            $builder->where('subject_area', $request->type);
        })
            ->paginate(20)
            ->withPath(route('data-detail.index'))
            ->withQueryString();

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailIndex', [
            'details' => $details,
            'types' => $referenceData,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(Request $request): Response
    {
        $source = $request->input('source');

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('SetupDatatable/SetupDatatablePage', [
            'types' => $referenceData,
            'source' => $source
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
                'updated_by' => Auth::user()?->id,
            ]);
        } catch (Exception $e) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()
            ->route('data-detail.show', $dataDetail->id);
    }

    public function show(DataDetail $dataDetail, QueryDataTable $queryDataTable, Request $request, DataTableFilter $filter): RedirectResponse|Response
    {

        $dataDetail->load(
            'dateFields',
            'dimensionFields.structure',
            'measureFields',
            'relationFields.relatedTable',
            'textFields'
        );

        $query = $queryDataTable->query($dataDetail);
        $filter->apply($query, $request, $dataDetail);

        $dataTable = $query->paginate(50)
            ->withPath(route('data-detail.show', $dataDetail->id))
            ->withQueryString();

        $jobs = DataLoaderJob::where('data_detail_id', $dataDetail->id)
            ->with('lastStatus', 'loaderQuery', 'latest')
            ->get();

        return Inertia::render('DataDetail/DataDetailShow', [
            'detail' => $dataDetail,
            'dataTableItems' => $dataTable,
            'jobs' => $jobs,
            'tab' => $request->input('tab', 'data'),
            'subsets' => SubsetDetail::where('data_detail_id', $dataDetail->id)->get(),
            'filters' => request()->all(),
        ]);
    }

    public function destroy(DataDetail $dataDetail, DeleteDataTable $deleteDataTable): RedirectResponse
    {
        try {
            $deleteDataTable->delete($dataDetail);
        } catch (Exception $exception) {

            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()
            ->route('data-detail.index')
            ->with([
                'message' => "Data Detail $dataDetail->name deleted successfully.",
            ]);
    }
}
