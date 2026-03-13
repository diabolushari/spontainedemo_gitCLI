<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\OrganizationFormRequest;
use App\Libs\SaveFile;
use App\Models\Meta\MetaHierarchy;
use App\Models\Organization;
use App\Models\OrganizationContextHistory;
use App\Models\OrganizationHierarchy;
use App\Models\OrganizationObjectives;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

final class OrganizationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function index(Request $request): Response
    {
        $query = Organization::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $organizations = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Organization/OrganizationIndexPage', [
            'organizations' => $organizations,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        return Inertia::render('Organization/OrganizationCreatePage', [
            'metaHierarchies' => $metaHierarchies,
        ]);
    }

    public function store(OrganizationFormRequest $request): RedirectResponse
    {
        $saveFile = new SaveFile;

        DB::beginTransaction();

        try {
            $organization = Organization::create($request->toArray());

            OrganizationContextHistory::create([
                'organization_id' => $organization->id,
                'context' => $organization->industry_context,
            ]);

            if ($request->metaHierarchyItemId) {
                OrganizationHierarchy::create([
                    'organization_id' => $organization->id,
                    'meta_hierarchy_item_id' => $request->metaHierarchyItemId,
                    'hierarchy_connection' => $request->hierarchyConnection ?? '',
                ]);
            }
            if ($request->logo) {

                $logoFileName = $saveFile->save(
                    $request->logo,
                    $organization->id,
                    'logo',
                     true
                );

                if ($logoFileName == '') {
                    DB::rollBack();

                    return redirect()->back()
                        ->with(['error' => 'Failed To Upload Logo']);
                }

                $organization->logo = $logoFileName;
                $organization->save();
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }

        return redirect()
            ->route('organization.index')
            ->with('message', 'Organization created successfully.');
    }

    public function show($id): Response
    {

        $organization = Organization::with([
            'hierarchy.metaHierarchyItem.primaryField.metaStructure',
            'hierarchy.metaHierarchyItem.secondaryField',
            'objectives',
        ])->findOrFail($id);

        return Inertia::render('Organization/OrganizationShowPage', [
            'organization' => $organization,
        ]);
    }

    public function edit($id): Response
    {
        $organization = Organization::with(['hierarchy.metaHierarchyItem.primaryField.metaStructure',
            'hierarchy.metaHierarchyItem.metaHierarchy'])->findOrFail($id);
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        // dd($organization, $metaHierarchies);
        return Inertia::render('Organization/OrganizationEditPage', [
            'organization' => $organization,
            'metaHierarchies' => $metaHierarchies,
        ]);
    }

    public function update(OrganizationFormRequest $request, $id): RedirectResponse
    {
        $organization = Organization::findOrFail($id);
        $saveFile = new SaveFile;

        DB::beginTransaction();

        try {

            $organization->update(
                collect($request->toArray())->except('logo')->toArray()
            );

            $newContext = $organization->industry_context ?? '';

            $lastContextValue = OrganizationContextHistory::where('organization_id', $organization->id)
                ->latest()
                ->value('context');

            if ($lastContextValue !== $newContext) {
                OrganizationContextHistory::create([
                    'organization_id' => $organization->id,
                    'context' => $newContext,
                ]);
            }

            if ($request->metaHierarchyItemId) {

                $hierarchy = OrganizationHierarchy::updateOrCreate(
                    ['organization_id' => $organization->id],
                    [
                        'meta_hierarchy_item_id' => $request->metaHierarchyItemId,
                        'hierarchy_connection' => $request->hierarchyConnection ?? '',
                    ]
                );
            } else {
                OrganizationHierarchy::where('organization_id', $organization->id)->delete();
                $organization->save();
            }

            if ($request->logo) {

                $logoFileName = $saveFile->save(
                    $request->logo,
                    $organization->id,
                    'logo',
                    true
                );

                if ($logoFileName == '') {
                    DB::rollBack();

                    return redirect()->back()
                        ->with(['error' => 'Failed To Upload Logo']);
                }

                $organization->logo = $logoFileName;
                $organization->save();
            }

            DB::commit();

        } catch (Exception $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }

        return redirect()
            ->route('organization.index')
            ->with('message', 'Organization updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();

        return redirect()->route('organization.index')
            ->with('message', 'Organization deleted successfully.');
    }

    public function updateObjectives(Request $request): RedirectResponse
    {
        $request->validate([
            'organization_id' => ['required', 'exists:organizations,id'],
            'objectives' => ['array'],
            'objectives.*.period_start' => ['required', 'date'],
            'objectives.*.period_end' => ['required', 'date'],
            'objectives.*.objective' => ['required', 'string'],
        ]);

        DB::beginTransaction();

        try {

            $organizationId = $request->organization_id;
            $submittedIds = [];

            foreach ($request->objectives ?? [] as $objectiveData) {

                if (isset($objectiveData['id']) && is_numeric($objectiveData['id'])) {

                    $objective = OrganizationObjectives::where('id', $objectiveData['id'])
                        ->where('organization_id', $organizationId)
                        ->first();

                    if ($objective) {
                        $objective->update([
                            'period_start' => $objectiveData['period_start'],
                            'period_end' => $objectiveData['period_end'],
                            'objective' => $objectiveData['objective'],
                        ]);

                        $submittedIds[] = $objective->id;
                    }

                } else {

                    $newObjective = OrganizationObjectives::create([
                        'organization_id' => $organizationId,
                        'period_start' => $objectiveData['period_start'],
                        'period_end' => $objectiveData['period_end'],
                        'objective' => $objectiveData['objective'],
                    ]);

                    $submittedIds[] = $newObjective->id;
                }
            }

            OrganizationObjectives::where('organization_id', $organizationId)
                ->whereNotIn('id', $submittedIds)
                ->delete();

            DB::commit();

            return redirect()->back()
                ->with('message', 'Objectives updated successfully.');

        } catch (Exception $e) {

            DB::rollBack();

            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
