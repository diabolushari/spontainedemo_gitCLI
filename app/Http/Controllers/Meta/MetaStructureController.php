<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaStructureFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Meta\DataClassificationProperty;

class MetaStructureController extends Controller implements HasMiddleware
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
            ->withPath(route('meta-structure.index'))
            ->withQueryString();

        return Inertia::render('MetaStructure/MetaStructureIndex', [
            'structures' => $structures,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(Request $request): Response
    {
        $dataClassificationProperties = DataClassificationProperty::all();

        return Inertia::render(
            'MetaStructure/MetaStructureCreate',
            [
                'type' => $request->type,
                'subtype' => $request->subtype,
                'dataClassificationProperties' => $dataClassificationProperties,
            ]
        );
    }

    public function store(MetaStructureFormRequest $request): RedirectResponse
    {
        try {
            $metaStructure = MetaStructure::create($request->all());

            $classificationIds = [
                $request->dataClassificationLevel,
                $request->dataCategory,
                $request->encryption,
                $request->accessLevel,
                $request->dataOwner,
            ];

            foreach ($classificationIds as $propertyId) {
                if ($propertyId) {
                    \App\Models\Meta\MetaStructureLabel::create([
                        'structure_id' => $metaStructure->id,
                        'data_classification_property_id' => $propertyId,
                    ]);
                }
            }

        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-structure.index')
            ->with(['message' => 'Meta structure ' . $request->structureName . ' created successfully']);
    }

    public function show(MetaStructure $metaStructure, Request $request): Response
    {
        $metaStructure->load('metaStructureLabels.dataClassificationProperty');

        return Inertia::render('MetaStructure/MetaStructureShow', ['metaStructure' => $metaStructure]);
    }

    public function edit(MetaStructure $metaStructure, Request $request): Response
    {
        $pageNo = $request->query('page', '1');
        $metaStructure->load('metaStructureLabels.dataClassificationProperty');
        $dataClassificationProperties = DataClassificationProperty::all();

        return Inertia::render('MetaStructure/MetaStructureEdit', [
            'metaStructure' => $metaStructure,
            'pageNo' => $pageNo,
            'dataClassificationProperties' => $dataClassificationProperties,
        ]);
    }

    public function update(MetaStructureFormRequest $request, MetaStructure $metaStructure, Request $page): RedirectResponse
    {

        $pageNo = $page->query('page', '1');
        try {
            $metaStructure->update($request->all());

            $metaStructure->metaStructureLabels()->delete();

            $classificationIds = [
                $request->dataClassificationLevel,
                $request->dataCategory,
                $request->encryption,
                $request->accessLevel,
                $request->dataOwner,
            ];

            foreach ($classificationIds as $propertyId) {
                if ($propertyId) {
                    \App\Models\Meta\MetaStructureLabel::create([
                        'structure_id' => $metaStructure->id,
                        'data_classification_property_id' => $propertyId,
                    ]);
                }
            }

        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('meta-structure.show', ['metaStructure' => $metaStructure, 'pageNo' => $pageNo])
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
}
