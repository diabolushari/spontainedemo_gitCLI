<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyLevelInfo;
use App\Models\Meta\MetaStructure;
use App\Services\MetaData\Hierarchy\HierarchyList;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $hierarchies = MetaHierarchy::when($request->filled(key: 'search'), function (Builder $query) use ($request) {
            $query->where('name', operator: 'like', value: '%' . $request->input(key: 'search') . '%')
                ->orWhereHas('items.metaHierarchy', function (Builder $query) use ($request) {
                    return $query->where('name', 'like', "%$request->search%");
                });
        })
            ->withCount('items')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaHierarchy/MetaHierarchyIndex', [
            'hierarchies' => $hierarchies,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
        ]);
    }

    public function create(Request $request): Response
    {

        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        return Inertia::render('MetaHierarchy/MetaHierarchyCreate', [
            'structures' => $structures,
        ]);
    }

    public function edit(MetaHierarchy $metaHierarchy): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])->get();
        $metaHierarchy->load('levelInfos.structure');
        return Inertia::render('MetaHierarchy/MetaHierarchyCreate', [
            'structures' => $structures,
            'metaHierarchy' => $metaHierarchy,
            'levelInfos' => $metaHierarchy->levelInfos,
        ]);
    }

    public function show(
        MetaHierarchy $metaHierarchy,
        Request $request,
        HierarchyList $hierarchyList
    ): Response {

        $metaHierarchy->load('levelInfos', 'levelInfos.structure:id,structure_name');

        return Inertia::render('MetaHierarchy/MetaHierarchyShow', [
            'metaHierarchy' => $metaHierarchy,
            'hierarchyList' => $hierarchyList->getHierarchy($metaHierarchy),
            'levelInfos' => $metaHierarchy->levelInfos,
        ]);
    }

    public function store(MetaHierarchyFormRequest $request): RedirectResponse
    {
        $hierarchyLevels = $request->hierarchyLevelInfos;

        DB::beginTransaction();

        try {
            $metaHierarchy = MetaHierarchy::create($request->all());
            foreach ($hierarchyLevels as &$tempLevel) {
                $tempLevel['meta_hierarchy_id'] = $metaHierarchy->id;
            }
            MetaHierarchyLevelInfo::upsert(
                $hierarchyLevels,
                ['level', 'meta_hierarchy_id'],
                ['meta_structure_id', 'level', 'meta_hierarchy_id'],
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

    public function update(MetaHierarchyFormRequest $request, MetaHierarchy $metaHierarchy): RedirectResponse
    {

        $hierarchyLevels = $request->hierarchyLevelInfos;
        DB::beginTransaction();
        // dd($hierarchyLevels);
        try {
            $metaHierarchy->update([
                'name' => $request->name,
                'description' => $request->description,
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
                ['meta_structure_id', 'level', 'meta_hierarchy_id'],
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
