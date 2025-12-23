<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\OrganizationFormRequest;
use App\Models\Meta\MetaHierarchy;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index(Request $request)
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

    public function create()
    {
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        return Inertia::render('Organization/OrganizationCreatePage', [
            'metaHierarchies' => $metaHierarchies,
        ]);
    }

    public function store(OrganizationFormRequest $request)
    {
        // The $request is already validated. 
        // We use toArray() to get the clean data from the DTO.
        // Note: This returns keys matching your DTO property names (e.g. camelCase).
        // If your DB requires snake_case, ensure your Model handles it or map the keys.
        Organization::create($request->toArray());

        return redirect()->route('organization.index')
            ->with('message', 'Organization created successfully.');
    }

    public function show($id)
    {
        $organization = Organization::with([
            'metaHierarchyItem.primaryField.metaStructure',
            'metaHierarchyItem.secondaryField',
        ])->findOrFail($id);

        return Inertia::render('Organization/OrganizationShowPage', [
            'organization' => $organization,
        ]);
    }

    public function edit($id)
    {
        $organization = Organization::with('metaHierarchyItem.primaryField.metaStructure')->findOrFail($id);
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        return Inertia::render('Organization/OrganizationEditPage', [
            'organization' => $organization,
            'metaHierarchies' => $metaHierarchies,
        ]);
    }

    public function update(OrganizationFormRequest $request, $id)
    {
        $organization = Organization::findOrFail($id);

        $organization->update($request->toArray());

        return redirect()->route('organization.index')
            ->with('message', 'Organization updated successfully.');
    }

    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);
        $organization->delete();

        return redirect()->route('organization.index')
            ->with('message', 'Organization deleted successfully.');
    }
}
