<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\HeirarchyLevel;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaStructure;
use App\Services\MetaData\Hierarchy\HierarchyList;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MetaHierarchyController extends Controller
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
        $hierarchies = MetaHierarchy::when($request->filled(key: 'search'), fn (Builder $builder) => $builder->where('name', operator: 'like', value: '%'.$request->input(key: 'search').'%'))
            ->withCount('items')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaHierarchy/MetaHierarchyIndex', [
            'hierarchies' => $hierarchies,
        ]);
    }

    public function create(): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        return Inertia::render('MetaHierarchy/MetaHierarchyCreate', [
            'structures' => $structures,
        ]);
    }

    public function edit(MetaHierarchy $metaHierarchy): Response
    {
        return Inertia::render('MetaHierarchy/MetaHierarchyEdit', [
            'hierarchy' => $metaHierarchy,
        ]);
    }

    public function show(
        MetaHierarchy $metaHierarchy,
        Request $request,
        HierarchyList $hierarchyList
    ): Response {
        return Inertia::render('MetaHierarchy/MetaHierarchyShow', [
            'metaHierarchy' => $metaHierarchy,
            'hierarchyList' => $hierarchyList->getHierarchy($metaHierarchy),
        ]);
    }

    public function store(MetaHierarchyFormRequest $request): RedirectResponse
    {
        $tempLevels = $request->heirachyArray;
        try {
            $metaHierarchy = MetaHierarchy::create($request->all());
            foreach ($tempLevels as &$tempLevel) {
                $tempLevel['meta_hierarchy_id'] = $metaHierarchy->id;
            }
            HeirarchyLevel::insert($tempLevels);
        } catch (Exception $exception) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        return redirect()
            ->route('meta-hierarchy.show', $metaHierarchy->id)
            ->with(['message' => "Meta Hierarchy $metaHierarchy->name created successfully."]);
    }

    public function update(MetaHierarchyFormRequest $request, MetaHierarchy $metaHierarchy): RedirectResponse
    {

        try {
            $metaHierarchy->update($request->all());
        } catch (Exception $exception) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        return redirect()
            ->route('meta-hierarchy.show', $metaHierarchy->id)
            ->with(['message' => "Meta Hierarchy $metaHierarchy->name updated successfully."]);
    }
}
