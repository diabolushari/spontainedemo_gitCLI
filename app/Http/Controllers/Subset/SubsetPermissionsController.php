<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetPermission;
use Illuminate\Http\Request;

class SubsetPermissionsController extends Controller
{
    public function store(Request $request)
    {
        $subsetId = $request->subset_id;

        $roleIds = collect($request->roles)
            ->pluck('role')
            ->map(fn ($id) => (int) $id)
            ->toArray();

        try {

            // Delete removed permissions
            SubsetPermission::where('subset_id', $subsetId)
                ->whereNotIn('group_id', $roleIds)
                ->delete();

            // Insert new ones (avoid duplicates)
            foreach ($roleIds as $groupId) {
                SubsetPermission::firstOrCreate([
                    'subset_id' => $subsetId,
                    'group_id' => $groupId,
                ]);
            }

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('subset.preview', $subsetId)
            ->with('message', 'Permissions updated successfully.');

    }
}
