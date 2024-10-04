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
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderJobController extends Controller
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
        $dataLoaderJobs = DataLoaderJob::paginate(20)
            ->withQueryString();
        $dataLoaderJobs->load('loaderQuery');

        return Inertia::render('DataLoader/DataLoaderJobIndex', [
            'dataLoaderJobs' => $dataLoaderJobs,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
        ]);
    }

    public function create(Request $request): Response
    {

        $connections = DataLoaderConnection::select('id', 'name')
            ->orderBy('name')
            ->get();

        $dataTables = DataDetail::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('DataLoader/DataLoaderJobCreate', [
            'connections' => $connections,
            'dataTables' => $dataTables,
            'type' => $request->type,
            'subtype' => $request->subtype
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

        $dataLoaderJob->load('loaderQuery:id,name', 'detail:id,name');

        return Inertia::render('DataLoader/DataLoaderJobShow', [
            'dataLoaderJob' => $dataLoaderJob,
        ]);
    }

    public function edit(DataLoaderJob $dataLoaderJob): Response
    {
        $connections = DataLoaderConnection::select('id', 'name')
            ->orderBy('name')
            ->get();

        $dataTables = DataDetail::select('id', 'name')
            ->orderBy('name')
            ->get();

        $query = DataLoaderQuery::select('id', 'name', 'connection_id')
            ->where('id', $dataLoaderJob->query_id)
            ->first();

        return Inertia::render('DataLoader/DataLoaderJobCreate', [
            'job' => $dataLoaderJob,
            'connections' => $connections,
            'dataTables' => $dataTables,
            'connectionId' => $query?->connection_id ?? null,
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
            ->route('loader-jobs.show', $dataLoaderJob->id)
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
