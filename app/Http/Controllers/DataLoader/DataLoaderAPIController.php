<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderAPIFormRequest;
use App\Http\Requests\DataLoader\DataLoaderAPISearchRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\LoaderAPI;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class DataLoaderAPIController extends Controller implements HasMiddleware
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

    public function index(DataLoaderAPISearchRequest $request): Response
    {
        /** @var LengthAwarePaginator<LoaderAPI> $dataLoaderAPIs */
        $dataLoaderAPIs = LoaderAPI::paginate(20)
            ->withQueryString();

        return Inertia::render('DataLoader/DataLoaderAPIIndex', [
            'dataLoaderAPIs' => $dataLoaderAPIs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DataLoader/DataLoaderAPICreate');
    }

    public function store(DataLoaderAPIFormRequest $request): RedirectResponse
    {
        try {
            /** @var LoaderAPI $record */
            $record = LoaderAPI::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-apis.show', $record->id)
            ->with(['message' => 'Data added successfully.']);
    }

    public function show(LoaderAPI $dataLoaderAPI): Response
    {
        return Inertia::render('DataLoader/DataLoaderAPIShow', [
            'dataLoaderAPI' => $dataLoaderAPI,
        ]);
    }

    public function edit(LoaderAPI $dataLoaderAPI): Response
    {
        return Inertia::render('DataLoader/DataLoaderAPICreate', [
            'dataLoaderAPI' => $dataLoaderAPI,
        ]);
    }

    public function update(DataLoaderAPIFormRequest $request, LoaderAPI $dataLoaderAPI): RedirectResponse
    {
        try {
            $dataLoaderAPI->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-apis.show', $dataLoaderAPI->id)
            ->with(['message' => 'Record updated successfully.']);
    }

    public function destroy(LoaderAPI $dataLoaderAPI): RedirectResponse
    {
        try {
            $dataLoaderAPI->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('loader-apis.index')
            ->with(['message' => 'Record deleted successfully.']);
    }
}
