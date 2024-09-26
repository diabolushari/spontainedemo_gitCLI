<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderConnectionFormRequest;
use App\Http\Requests\DataLoader\DataLoaderConnectionSearchRequest;
use App\Http\Requests\DataLoader\DataLoaderConnectionUpdateRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use App\Services\DataLoader\Connection\LoaderConnectionStatusCheck;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderConnectionController extends Controller
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

    public function index(DataLoaderConnectionSearchRequest $request): Response
    {
        /** @var LengthAwarePaginator<DataLoaderConnection> $dataLoaderConnections */
        $dataLoaderConnections = DataLoaderConnection::when(
            $request->search != null,
            fn($query) => $query->where('name', 'like', "%$request->search%")
        )
            ->withCount('queries')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('DataLoader/DataLoaderConnectionIndex', [
            'dataLoaderConnections' => $dataLoaderConnections,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('DataLoader/DataLoaderConnectionCreate', ['type' => $request->type, 'subtype' => $request->subtype]);
    }

    public function store(DataLoaderConnectionFormRequest $request): RedirectResponse
    {
        try {
            /** @var DataLoaderConnection $record */
            $record = DataLoaderConnection::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-connections.show', $record->id)
            ->with(['message' => 'Data added successfully.']);
    }

    public function show(DataLoaderConnection $dataLoaderConnection, LoaderConnectionStatusCheck $statusCheck, Request $parameters): Response
    {
        return Inertia::render('DataLoader/DataLoaderConnectionShow', [
            'dataLoaderConnection' => $dataLoaderConnection,
            'status' => $statusCheck->checkStatus(
                $dataLoaderConnection
            ),
            'type' => $parameters->type,
            'subtype' => $parameters->subtype
        ]);
    }

    public function edit(DataLoaderConnection $dataLoaderConnection): Response
    {
        return Inertia::render('DataLoader/DataLoaderConnectionEdit', [
            'dataLoaderConnection' => $dataLoaderConnection,
        ]);
    }

    public function update(DataLoaderConnectionUpdateRequest $request, DataLoaderConnection $dataLoaderConnection): RedirectResponse
    {
        try {
            $dataLoaderConnection->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-connections.show', $dataLoaderConnection->id)
            ->with(['message' => 'Record updated successfully.']);
    }

    public function destroy(DataLoaderConnection $dataLoaderConnection): RedirectResponse
    {
        //check if used by any queries
        if (DataLoaderQuery::where('connection_id', $dataLoaderConnection->id)->exists()) {
            return back()
                ->with(['error' => 'Record cannot be deleted as it is used by some queries.']);
        }

        try {
            $dataLoaderConnection->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-connections.index')
            ->with(['message' => 'Record deleted successfully.']);
    }
}
