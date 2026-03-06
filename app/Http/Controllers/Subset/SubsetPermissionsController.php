<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetPermission;
use Illuminate\Http\Request;

class SubsetPermissionsController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'subset_id' => 'required|exists:subset_details,id',
        //     'roles' => 'required|array|min:1',
        //     'roles.*.role' => 'required|integer|exists:user_groups,id',
        // ]);

        $subsetId = $request->subset_id;
        $now = now();

        $formatted = collect($request->roles)->map(function ($item) use ($subsetId, $now) {
            return [
                'subset_id' => $subsetId,
                'group_id' => (int) $item['role'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->toArray();
// dd($formatted);
        try {
            SubsetPermission::insert($formatted);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('subset.preview', $subsetId)
            ->with('success', 'User group created successfully.');
    }
}
