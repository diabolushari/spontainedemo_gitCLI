<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaData;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use App\Models\Meta\MetaHierarchyLevelInfo;
use App\Models\Meta\MetaStructure;
use App\Services\MetaData\Hierarchy\HierarchyList;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MetaHierarchyController extends Controller implements HasMiddleware
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
        if ($request->filled('search')) {
            $search = $request->input('search');

            $matchedMetadataIds = MetaData::where('name', $search)->pluck('id');

            $matchedItems = MetaHierarchyItem::whereIn('primary_field_id', $matchedMetadataIds)
                ->orWhereIn('secondary_field_id', $matchedMetadataIds)
                ->get()
                ->unique('id')
                ->values();

            $metaHierarchyIds = $matchedItems->pluck('meta_hierarchy_id')->unique()->filter()->values();

            $hierarchies = MetaHierarchy::whereIn('id', $metaHierarchyIds)->paginate(20);

        } else {
            $hierarchies = MetaHierarchy::withCount('items')
                ->paginate(20)
                ->withPath(route('meta-hierarchy.index'))
                ->withQueryString();
        }

        return Inertia::render('MetaHierarchy/MetaHierarchyIndex', [
            'hierarchies' => $hierarchies,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(Request $request): Response
    {

        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        return Inertia::render('MetaHierarchy/MetaHierarchyCreate', [
            'structures' => $structures,
        ]);
    }

    public function edit(MetaHierarchy $metaHierarchy, Request $request): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])->get();
        $metaHierarchy->load('levels.primaryStructure:id,structure_name', 'levels.secondaryStructure:id,structure_name');
        $pageNo = $request->query('page', '1');

        return Inertia::render('MetaHierarchy/MetaHierarchyCreate', [
            'structures' => $structures,
            'metaHierarchy' => $metaHierarchy,
            'levelInfos' => $metaHierarchy->levels,
            'page' => $pageNo,
        ]);
    }

    public function show(
        MetaHierarchy $metaHierarchy,
        Request $request,
        HierarchyList $hierarchyList
    ): Response {
        $metaHierarchy->load(
            'levels',
            'levels.primaryStructure:id,structure_name',
            'levels.secondaryStructure:id,structure_name',
        );
        $pageNo = $request->query('page', '1');

        return Inertia::render('MetaHierarchy/MetaHierarchyShow', [
            'metaHierarchy' => $metaHierarchy,
            'hierarchyList' => $hierarchyList->getHierarchy($metaHierarchy),
            'page' => $pageNo,
        ]);
    }

    public function store(MetaHierarchyFormRequest $request): RedirectResponse
    {

        $hierarchyLevels = $request->hierarchyLevelInfos;

        DB::beginTransaction();

        try {
            $metaHierarchy = MetaHierarchy::create([
                ...$request->all(),
                'primary_column' => Str::snake($request->primaryFieldName),
                'secondary_column' => $request->secondaryFieldName != null ? Str::snake($request->secondaryFieldName) : null,
            ]);
            foreach ($hierarchyLevels as &$tempLevel) {
                $tempLevel['meta_hierarchy_id'] = $metaHierarchy->id;
            }
            MetaHierarchyLevelInfo::upsert(
                $hierarchyLevels,
                ['level', 'meta_hierarchy_id'],
                ['primary_field_structure_id', 'level', 'meta_hierarchy_id', 'secondary_field_structure_id', 'name'],
            );
        } catch (Exception $exception) {
            DB::rollBack();

            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        DB::commit();

        return redirect()
            ->route('meta-hierarchy.show', $metaHierarchy->id)
            ->with(['message' => "Meta Hierarchy $metaHierarchy->name created successfully."]);
    }

    public function update(MetaHierarchyFormRequest $request, MetaHierarchy $metaHierarchy, Request $page): RedirectResponse
    {
        $pageNo = $page->query('page', '1');
        $hierarchyLevels = $request->hierarchyLevelInfos;
        DB::beginTransaction();
        try {
            $metaHierarchy->update([
                'name' => $request->name,
                'description' => $request->description,
                'primary_field_name' => $request->primaryFieldName,
                'secondary_field_name' => $request->secondaryFieldName,
                'primary_column' => Str::snake($request->primaryFieldName),
                'secondary_column' => $request->secondaryFieldName != null ? Str::snake($request->secondaryFieldName) : null,
            ]);

            foreach ($hierarchyLevels as &$tempLevel) {
                $tempLevel['meta_hierarchy_id'] = $metaHierarchy->id;
            }

            //levels that are going to be updated/created
            $levelsNotToBeDeleted = array_column($hierarchyLevels, 'level');

            //delete existing  levels that are not in the new hierarchy levels
            MetaHierarchyLevelInfo::where('meta_hierarchy_id', $metaHierarchy->id)
                ->whereNotIn('level', $levelsNotToBeDeleted)
                ->delete();

            //restore deleted levels, that are going to be updated
            MetaHierarchyLevelInfo::withTrashed()
                ->whereNotNull('deleted_at')
                ->where('meta_hierarchy_id', $metaHierarchy->id)
                ->whereIn('level', $levelsNotToBeDeleted)
                ->restore();

            MetaHierarchyLevelInfo::upsert(
                $hierarchyLevels,
                ['level', 'meta_hierarchy_id'],
                ['primary_field_structure_id', 'level', 'meta_hierarchy_id', 'secondary_field_structure_id', 'name'],
            );
        } catch (Exception $exception) {
            DB::rollBack();

            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        DB::commit();

        return redirect()
            ->route('meta-hierarchy.show', ['metaHierarchy' => $metaHierarchy->id, 'page' => $pageNo])
            ->with(['message' => "Meta Hierarchy $metaHierarchy->name created successfully."]);
    }

    public function destroy(MetaHierarchy $metaHierarchy): RedirectResponse
    {
        try {
            $metaHierarchy->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-hierarchy.index')
            ->with(['message' => "Meta Hierarchy: $metaHierarchy->name deleted successfully"]);
    }
}
