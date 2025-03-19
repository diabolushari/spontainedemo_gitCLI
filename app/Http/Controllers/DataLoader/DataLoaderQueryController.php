<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderQueryFormRequest;
use App\Http\Requests\DataLoader\DataLoaderQuerySearchRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderQueryController extends Controller implements HasMiddleware
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
            ->withPath(route('loader-queries.index'))
            ->withQueryString();

        return Inertia::render('DataLoader/DataLoaderQueryIndex', [
            'dataLoaderQueries' => $dataLoaderQueries,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(Request $request): Response
    {

        $connections = DataLoaderConnection::select([
            'id',
            'name',
        ])->get();

        return Inertia::render('DataLoader/DataLoaderQueryCreate', [
            'connections' => $connections,
            'type' => $request->type,
            'subtype' => $request->subtype,
        ]);
    }

    public function store(DataLoaderQueryFormRequest $request): RedirectResponse
    {
        try {
            /** @var DataLoaderQuery $record */
            $record = DataLoaderQuery::create([
                ...$request->all(),
            ]);
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
    ): Response {
        $dataLoaderQuery->load('loaderConnection');

        return Inertia::render('DataLoader/DataLoaderQueryShow', [
            'dataLoaderQuery' => $dataLoaderQuery,
            'error' => '',
            'errorMessage' => '',
            'result' => [],
        ]);
    }

    public function edit(DataLoaderQuery $dataLoaderQuery, Request $request): Response
    {
        $connections = DataLoaderConnection::select([
            'id',
            'name',
        ])->get();

        return Inertia::render('DataLoader/DataLoaderQueryEdit', [
            'dataLoaderQuery' => $dataLoaderQuery,
            'connections' => $connections,
            'type' => $request->type,
            'subtype' => $request->subtype,
        ]);
    }

    public function update(DataLoaderQueryFormRequest $request, DataLoaderQuery $dataLoaderQuery): RedirectResponse
    {
        //        $escapeCharacters = ['\n', '\r', '\t'];
        try {
            $dataLoaderQuery->update([
                ...$request->all(),
                //                'query' => str_replace($escapeCharacters, ' ', $request->query),
            ]);
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
