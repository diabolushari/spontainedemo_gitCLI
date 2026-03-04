<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function findOrganization(Request $request): JsonResponse
    {
        $search = $request->input('search');

        if (empty($search)) {
            return response()->json([]);
        }

        $organizations = Organization::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })->limit(15)->get();

        return response()->json($organizations);
    }
}
