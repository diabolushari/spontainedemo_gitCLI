<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\OrganizationFormRequest;
use App\Libs\SaveFile;
use App\Models\Meta\MetaHierarchy;
use App\Models\Organization;
use App\Models\OrganizationContext;
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
        // The $request is already validated.
        // We use toArray() to get the clean data from the DTO.
        // Note: This returns keys matching your DTO property names (e.g. camelCase).
        // If your DB requires snake_case, ensure your Model handles it or map the keys.
        // dd($request->all());
        $saveFile = new SaveFile;
        DB::beginTransaction();
        try {
            $organization = Organization::create($request->toArray());

            OrganizationContext::create([
                'organization_id' => $organization->id,
                'context' => $organization->industry_context,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }
        $logoFileName = $saveFile->save($request->logo, $organization->id, 'logo', false);

        if ($logoFileName == '') {
            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => 'Failed To Upload Logo']);
        }
        $organization->logo = $logoFileName;
        if ($organization->save()) {
            DB::commit();

            return redirect()->route('organization.index')
                ->with('message', 'Organization created successfully.');
        }

        DB::rollBack();

        return redirect()
            ->back()
            ->with(['error' => 'Failed To Create Organization']);

    }

    public function show($id): Response
    {
        $organization = Organization::with([
            'metaHierarchyItem.primaryField.metaStructure',
            'metaHierarchyItem.secondaryField',
        ])->findOrFail($id);

        return Inertia::render('Organization/OrganizationShowPage', [
            'organization' => $organization,
        ]);
    }

    public function edit($id): Response
    {
        $organization = Organization::with('metaHierarchyItem.primaryField.metaStructure')->findOrFail($id);
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

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
            // Update organization fields (excluding logo)
            $organization->update(
                collect($request->toArray())->except('logo')->toArray()
            );

            // Update organization context
            OrganizationContext::create([
                'organization_id' => $organization->id,
                'context' => $organization->industry_context ?? '',
            ]);

            // Handle logo update if new file uploaded
            if ($request->logo) {

                $logoFileName = $saveFile->save(
                    $request->logo,
                    $organization->id,
                    'logo',
                    false
                );

                if ($logoFileName == '') {
                    DB::rollBack();

                    return redirect()
                        ->back()
                        ->with(['error' => 'Failed To Upload Logo']);
                }

                // Optional: delete old logo here if your SaveFile doesn't handle it

                $organization->logo = $logoFileName;

                if (! $organization->save()) {
                    DB::rollBack();

                    return redirect()
                        ->back()
                        ->with(['error' => 'Failed To Update Organization']);
                }
            }

            DB::commit();

            return redirect()
                ->route('organization.index')
                ->with('message', 'Organization updated successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }
    }

    public function destroy($id): RedirectResponse
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();

        return redirect()->route('organization.index')
            ->with('message', 'Organization deleted successfully.');
    }
}
