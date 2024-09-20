<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\HeirarchyLevel;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use App\Models\Meta\MetaStructure;
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
        $hierarchies = MetaHierarchy::when($request->filled(key: 'search'), fn(Builder $builder) => $builder->where('name', operator: 'like', value: '%' . $request->input(key: 'search') . '%'))
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
        return Inertia::render('MetaHierarchy/MetaHierarchyCreate',[
            'structures' => $structures
        ]);
    }

    public function edit(MetaHierarchy $metaHierarchy): Response
    {
        return Inertia::render('MetaHierarchy/MetaHierarchyEdit', [
            'hierarchy' => $metaHierarchy,
        ]);
    }

    public function show(MetaHierarchy $metaHierarchy, Request $request): Response
    {
        $node = null;
        if ($request->filled('node')) {
            $node = MetaHierarchyItem::where('id', $request->node)
                ->with('metaData:id,name')
                ->with('metaData.metaStructure:id,structure_name')
                ->first();
        }

        $items = MetaHierarchyItem::with('metaData:id,name')
            ->with('metaData.metaStructure:id,structure_name')
            ->where('meta_hierarchy_id', $metaHierarchy->id)
            ->when($node != null, fn($q) => $q->where('parent_id', $node->id))
            ->when($node == null, fn($q) => $q->whereNull('parent_id'))
            ->get();

        return Inertia::render('MetaHierarchy/MetaHierarchyShow', [
            'metaHierarchy' => $metaHierarchy,
            'hierarchyItems' => $items,
            'currentNode' => $node,
        ]);
    }

    public function store(MetaHierarchyFormRequest $request): RedirectResponse
    {
        $tempLevels = $request->heirachyArray;
        try {
            $metaHierarchy = MetaHierarchy::create($request->all());
            foreach($tempLevels as &$tempLevel) {
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
