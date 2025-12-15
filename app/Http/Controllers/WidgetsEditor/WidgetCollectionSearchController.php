<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\WidgetCollection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetCollectionSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $collections = WidgetCollection::all();
        return response()->json($collections);
    }
}
