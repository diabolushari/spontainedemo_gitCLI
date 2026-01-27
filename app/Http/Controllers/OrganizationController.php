<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\OrganizationFormRequest;
use Illuminate\Http\Request;
use App\Models\Meta\MetaHierarchy;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
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
            $query->where('name', 'like', '%' . $request->search . '%');
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
        Organization::create($request->toArray());

        return redirect()->route('organization.index')
            ->with('message', 'Organization created successfully.');
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

        $organization->update($request->toArray());

        return redirect()->route('organization.index')
            ->with('message', 'Organization updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();

        return redirect()->route('organization.index')
            ->with('message', 'Organization deleted successfully.');
    }
}
