<?php

namespace App\Http\Controllers\Map;

use App\Http\Controllers\Controller;
use App\Models\Map\OfficeCoordinates;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfficeCoordinateListController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {

        $coordinates = OfficeCoordinates::all();

        return response()->json($coordinates);

    }
}
