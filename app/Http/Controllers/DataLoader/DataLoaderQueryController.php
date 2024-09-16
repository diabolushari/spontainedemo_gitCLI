<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderQueryFormRequest;
use App\Http\Requests\DataLoader\DataLoaderQuerySearchRequest;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use App\Services\DataLoader\Connection\RunLoaderQuery;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderQueryController extends Controller
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

    public function index(DataLoaderQuerySearchRequest $request): Response
    {
        /** @var LengthAwarePaginator<DataLoaderQuery> $dataLoaderQueries */
        $dataLoaderQueries = DataLoaderQuery::when(
            $request->search != null,
            fn ($query) => $query->where('name', 'like', "%$request->search%")
        )
            ->with('loaderConnection:id,name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('DataLoader/DataLoaderQueryIndex', [
            'dataLoaderQueries' => $dataLoaderQueries,
        ]);
    }

    public function create(): Response
    {

        $connections = DataLoaderConnection::select([
            'id', 'name',
        ])->get();

        return Inertia::render('DataLoader/DataLoaderQueryCreate', [
            'connections' => $connections,
        ]);
    }

    public function store(DataLoaderQueryFormRequest $request): RedirectResponse
    {
        try {
            /** @var DataLoaderQuery $record */
            $record = DataLoaderQuery::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-queries.show', $record->id)
            ->with(['message' => 'Data added successfully.']);
    }

    public function show(
        DataLoaderQuery $dataLoaderQuery,
        RunLoaderQuery $runLoaderQuery
    ): Response {
        $dataLoaderQuery->load('loaderConnection');

        $error = new OperationResult(false, '');

        $result = [];

        if ($dataLoaderQuery->loaderConnection == null) {
            $error->message = 'Connection not found';
        } else {
            try {
                $result = $runLoaderQuery->runQuery($dataLoaderQuery->loaderConnection, $dataLoaderQuery);
                $noOfRecords = count($result);
                $error->message = "Query executed successfully, $noOfRecords records found.";
            } catch (Exception $e) {
                $error->error = true;
                $error->message = ExceptionMessage::getMessage($e);
            }
        }

        return Inertia::render('DataLoader/DataLoaderQueryShow', [
            'dataLoaderQuery' => $dataLoaderQuery,
            'error' => $error->error,
            'errorMessage' => $error->message,
            'result' => array_slice($result, 0, 10),
        ]);
    }

    public function edit(DataLoaderQuery $dataLoaderQuery): Response
    {
        $connections = DataLoaderConnection::select([
            'id', 'name',
        ])->get();

        return Inertia::render('DataLoader/DataLoaderQueryEdit', [
            'dataLoaderQuery' => $dataLoaderQuery,
            'connections' => $connections,
        ]);
    }

    public function update(DataLoaderQueryFormRequest $request, DataLoaderQuery $dataLoaderQuery): RedirectResponse
    {
        try {
            $dataLoaderQuery->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-queries.show', $dataLoaderQuery->id)
            ->with(['message' => 'Record updated successfully.']);
    }

    public function destroy(DataLoaderQuery $dataLoaderQuery): RedirectResponse
    {
        try {
            $dataLoaderQuery->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-queries.index')
            ->with(['message' => 'Record deleted successfully.']);
    }
}
