<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaData;
use App\Models\Meta\MetaGroup;
use App\Models\Meta\MetaGroupItem;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class MetaDataController extends Controller implements HasMiddleware
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

    public function index(Request $request): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        $records = MetaData::with([
            'metaStructure:id,structure_name',
        ])
            ->when($request->filled('search'), function (Builder $builder) use ($request) {
                $searchTerm = '%'.$request->input('search').'%';
                $builder->where('name', 'like', $searchTerm);
            })
            ->when($request->filled('structure'), function (Builder $builder) use ($request) {
                $builder->whereHas('metaStructure', function (Builder $query) use ($request) {
                    $query->where('id', $request->input('structure'));
                });
            })
            ->withCount('hierarchyPrimaryField', 'hierarchySecondaryField', 'groupItem')
            ->paginate(25)
            ->withPath(route('meta-data.index'))
            ->withQueryString();

        $oldStructure = $request->filled('structure') ? MetaStructure::find($request->structure) : null;

        return Inertia::render('MetaData/MetaDataIndex', [
            'metaData' => $records,
            'structures' => $structures,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => [
                'search' => $request->search ?? '',
                'structure' => $oldStructure,
            ],
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

    public function edit(MetaData $metaData, Request $request): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();
        $pageNo = $request->query('page', '1');

        return Inertia::render('MetaData/MetaDataEdit', [
            'metaData' => $metaData,
            'structures' => $structures,
            'pageNo' => $pageNo,
        ]);
    }

    public function show(MetaData $metaData, Request $request): Response
    {
        $metaData->load('groupItem.metaDataGroup');
        $pageNo = $request->query('page', '1');
        $metaGroup = MetaGroup::select('id', 'name')
            ->get();

        $hierarchies = MetaHierarchyItem::where('primary_field_id', $metaData->id)
            ->orWhere('secondary_field_id', $metaData->id)
            ->pluck('meta_hierarchy_id');

        $hierarchies = MetaHierarchy::whereIn('id', $hierarchies)
            ->get();

        return Inertia::render('MetaData/MetaDataShow', [
            'metaData' => $metaData->load([
                'metaStructure:id,structure_name',
            ]),
            'metaGroup' => $metaGroup,
            'hierarchies' => $hierarchies,
            'pageNo' => $pageNo,
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

    public function update(MetaDataFormRequest $request, MetaData $metaData, Request $page): RedirectResponse
    {
        $pageNo = $page->query('page', '1');
        try {
            $metaData->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-data.show', ['metaData' => $metaData, 'page' => $pageNo])
            ->with(['message' => "Meta Data: $request->name updated successfully"]);
    }

    public function destroy(MetaData $metaData): RedirectResponse
    {
        try {
            MetaGroupItem::where('meta_data_id', $metaData->id)->delete();
            $metaData->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-data.index')
            ->with(['message' => "Meta Data: $metaData->name deleted successfully"]);
    }

    public function test(): Response
    {
        return Inertia::render('Test/test');
    }
}
