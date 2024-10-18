<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaData;
use App\Models\Meta\MetaGroup;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function index(Request $request): Response
    {

        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();
        $records = MetaData::with([
            'metaStructure:id,structure_name',
            'hierarchyItem',
            'groupItem',
        ])
            ->when($request->filled(key: 'search'), fn(Builder $builder) => $builder
                ->where('name', operator: 'like', value: '%' . $request->input(key: 'search') . '%')
                ->orWhereHas('groupItem.metaDataGroup', function (Builder $query) use ($request) {
                    return $query->where('name', $request->search);
                })
                ->orWhereHas('hierarchyItem.metaHierarchy', function (Builder $query) use ($request) {
                    return $query->where('name', $request->search);
                }))
            ->when($request->filled('structure'), function (Builder $query) use ($request) {
                $query->whereHas('metaStructure',  function (Builder $query) use ($request) {
                    return $query->where('structure_name', 'like', "%$request->structure%");
                });
            })
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaData/MetaDataIndex', [
            'metaData' => $records,
            'structures' => $structures,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
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
            'pageNo' => $pageNo ,
        ]);
    }

    public function show(MetaData $metaData, Request $request): Response
    { 
        $metaData->load('hierarchyItem.metaHierarchy');
        $metaData->load('groupItem.metaDataGroup');
        $pageNo = $request->query('page', '1');
        $metaGroup = MetaGroup::select('id', 'name')
            ->get();

        $metaHierarchy = MetaHierarchy::select('id', 'name')
            ->get();

        return Inertia::render('MetaData/MetaDataShow', [
            'metaData' => $metaData->load([
                'metaStructure:id,structure_name',
            ]),
            'metaGroup' => $metaGroup,
            'metaHierarchy' => $metaHierarchy,
            'pageNo' => $pageNo 
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
            ->route('meta-data.show',['metaData'=>$metaData,'page'=>$pageNo ])
            ->with(['message' => "Meta Data: $request->name updated successfully"]);
    }

    public function destroy(MetaData $metaData): RedirectResponse
    {
        try {
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
