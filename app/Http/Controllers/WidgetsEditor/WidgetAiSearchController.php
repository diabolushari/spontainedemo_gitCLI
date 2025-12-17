<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\Widget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetAiSearchController extends Controller
{
    /**
     * Search for widgets specifically by subset_id to aid AI deduplication.
     * Returns a simple list of matches without pagination.
     */
    public function __invoke(Request $request): JsonResponse
    {
        if (!$request->filled('subset_id')) {
            return response()->json([]);
        }

        $subsetId = $request->input('subset_id');

        $widgets = Widget::query()
            ->where(function (Builder $query) use ($subsetId) {
                $query->where('data->overview->subset_id', $subsetId)
                    ->orWhere('data->trend->subset_id', $subsetId)
                    ->orWhere('data->rank->subset_id', $subsetId)
                    ->orWhere('data->subset_id', $subsetId);
            })
            ->select(['id', 'title', 'type', 'data', 'created_at'])
            ->orderBy('updated_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json($widgets);
    }
}
