<?php

namespace App\Http\Controllers\InsightsGen;

use App\Models\Insights\Insights;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GetInsights extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $data = Insights::all();
        return response()->json($data);
    }
}
