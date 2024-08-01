<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaData;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MetaDataController extends Controller
{
    /**
     * Get the middleware for the controller.
     *
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function index(): Response
    {

        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();

        $records = MetaData::with([
            'metaStructure:id,structure_name',
        ])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaData/MetaDataIndex', [
            'metaData' => $records,
            'structures' => $structures,
        ]);
    }

    public function create(): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();

        return Inertia::render('MetaData/MetaDataCreate', [
            'structures' => $structures,
        ]);
    }

    public function edit(MetaData $metaData): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();

        return Inertia::render('MetaData/MetaDataEdit', [
            'metaData' => $metaData,
            'structures' => $structures,
        ]);
    }

    public function show(MetaData $metaData): Response
    {
        return Inertia::render('MetaData/MetaDataShow', [
            'metaData' => $metaData->load([
                'metaStructure:id,structure_name',
            ]),
        ]);
    }

    public function store(MetaDataFormRequest $request): RedirectResponse
    {
        try {
            $record = MetaData::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-data.index')
            ->with(['message' => "Meta Data: $record->name created successfully"]);
    }

    public function update(MetaDataFormRequest $request, MetaData $metaData): RedirectResponse
    {
        try {
            $metaData->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-data.index')
            ->with(['message' => "Meta Data: $request->name updated successfully"]);
    }
}
