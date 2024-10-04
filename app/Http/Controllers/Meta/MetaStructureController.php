<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaStructureFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class MetaStructureController extends Controller
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

    public function index(Request $request): Response
    {
        $structures = MetaStructure::withCount('metaData')
            ->when($request->filled(key: 'search'), fn(Builder $builder) => $builder
                ->where('structure_name', operator: 'like', value: '%' . $request->input(key: 'search') . '%'))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaStructure/MetaStructureIndex', [
            'structures' => $structures,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render(
            'MetaStructure/MetaStructureCreate',
            [
                'type' => $request->type,
                'subtype' => $request->subtype
            ]
        );
    }

    public function store(MetaStructureFormRequest $request): RedirectResponse
    {
        try {
            MetaStructure::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-structure.index')
            ->with(['message' => 'Meta structure ' . $request->structureName . ' created successfully']);
    }

    public function show(MetaStructure $metaStructure)
    {
        //
    }

    public function edit(MetaStructure $metaStructure): Response
    {
        return Inertia::render('MetaStructure/MetaStructureEdit', [
            'metaStructure' => $metaStructure,
        ]);
    }

    public function update(MetaStructureFormRequest $request, MetaStructure $metaStructure): RedirectResponse
    {
        try {
            $metaStructure->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-structure.index')
            ->with(['message' => 'Meta structure ' . $request->structureName . ' updated successfully']);
    }

    public function destroy(MetaStructure $metaStructure): RedirectResponse
    {
        try {
            $metaStructure->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-structure.index')
            ->with(['success' => 'Meta structure ' . $metaStructure->structure_name . ' deleted successfully']);
    }

    public function metaStructureSearch(Request $request): JsonResponse
    {
        if ($request->search == null) {
            return response()
                ->json();
        }

        $structures = MetaStructure::withCount('metaData')
            ->when($request->filled(key: 'search'), fn(Builder $builder) => $builder
                ->where('structure_name', operator: 'like', value: '%' . $request->input(key: 'search') . '%'))->get();
                Log::info($request->all());
        return response()
            ->json($structures);
    }
}
