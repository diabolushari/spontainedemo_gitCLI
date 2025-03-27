<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderJobFormRequest;
use App\Http\Requests\DataLoader\DataLoaderJobSearchRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataLoader\DataLoaderQuery;
use App\Models\DataLoader\LoaderAPI;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderJobController extends Controller implements HasMiddleware
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

    public function index(DataLoaderJobSearchRequest $request): Response
    {
        /** @var LengthAwarePaginator<DataLoaderJob> $dataLoaderJobs */
        $dataLoaderJobs = DataLoaderJob::with(['loaderQuery', 'latest'])
            ->paginate(20)
            ->withPath(route('loader-jobs.index'))
            ->withQueryString();

        return Inertia::render('DataLoader/DataLoaderJobIndex', [
            'dataLoaderJobs' => $dataLoaderJobs,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(Request $request): Response
    {
        $dataDetail = DataDetail::where('id', $request->input('dataDetail'))
            ->with(['dateFields', 'dimensionFields'])
            ->firstOrFail();

        $connections = DataLoaderConnection::select('id', 'name')
            ->orderBy('name')
            ->get();

        $dataDetails = DataDetail::with(['jobs' => fn ($query) => $query->select('id', 'name', 'data_detail_id')])
            ->whereHas('jobs')
            ->select('name', 'id')
            ->orderBy('name')
            ->get();

        $apis = LoaderAPI::select('id', 'name', 'response_structure')
            ->orderBy('name')
            ->get();

        return Inertia::render('DataLoader/DataLoaderJobCreate', [
            'connections' => $connections,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'dataDetail' => $dataDetail,
            'dataDetails' => $dataDetails,
            'apis' => $apis,
        ]);
    }

    public function store(DataLoaderJobFormRequest $request): RedirectResponse
    {
        try {
            /** @var DataLoaderJob $record */
            $record = DataLoaderJob::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-jobs.show', $record->id)
            ->with(['message' => 'Data added successfully.']);
    }

    public function show(DataLoaderJob $dataLoaderJob): Response
    {
        $dataLoaderJob->load(
            'loaderQuery:id,name',
            'detail:id,name',
            'statuses',
            'api:id,name',
        );

        return Inertia::render('DataLoader/DataLoaderJobShow', [
            'dataLoaderJob' => $dataLoaderJob,
        ]);
    }

    public function edit(DataLoaderJob $dataLoaderJob): Response
    {
        $connections = DataLoaderConnection::select('id', 'name')
            ->orderBy('name')
            ->get();

        $query = DataLoaderQuery::select('id', 'name', 'connection_id')
            ->where('id', $dataLoaderJob->query_id)
            ->first();

        $dataDetail = DataDetail::where('id', $dataLoaderJob->data_detail_id)
            ->with(['dateFields', 'dimensionFields'])
            ->firstOrFail();

        $dataDetails = DataDetail::with(['jobs' => fn ($query) => $query->select('id', 'name', 'data_detail_id')])
            ->whereHas('jobs')
            ->select('name', 'id')
            ->orderBy('name')
            ->get();

        $apis = LoaderAPI::select('id', 'name', 'response_structure')
            ->orderBy('name')
            ->get();

        return Inertia::render('DataLoader/DataLoaderJobCreate', [
            'job' => $dataLoaderJob,
            'connections' => $connections,
            'dataDetail' => $dataDetail,
            'connectionId' => $query?->connection_id ?? null,
            'dataDetails' => $dataDetails,
            'apis' => $apis,
        ]);
    }

    public function update(DataLoaderJobFormRequest $request, DataLoaderJob $dataLoaderJob): RedirectResponse
    {
        try {
            $dataLoaderJob->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('data-detail.show', [
                'dataDetail' => $dataLoaderJob->data_detail_id,
                'tab' => 'jobs',
            ])
            ->with(['message' => 'Record updated successfully.']);
    }

    public function destroy(DataLoaderJob $dataLoaderJob): RedirectResponse
    {
        try {
            $dataLoaderJob->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-jobs.index')
            ->with(['message' => 'Record deleted successfully.']);
    }
}
