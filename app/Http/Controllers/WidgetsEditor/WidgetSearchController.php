<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\Widget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = Widget::query()
            // Filter by search term
            ->when($request->filled('search'), function (Builder $builder) use ($request) {
                $searchTerm = strtolower($request->input('search'));

                $builder->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(title) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(subtitle) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(type) LIKE ?', ["%{$searchTerm}%"]);
                });
            })
            // Filter by collections
            ->when($request->filled('collections'), function (Builder $builder) use ($request) {
                $collections = $request->input('collections');

                // Ensure collections is an array
                if (!is_array($collections)) {
                    $collections = explode(',', $collections);
                }

                $builder->whereIn('collection_id', $collections);
            })
            // Order by most recently updated first
            ->orderBy('updated_at', 'desc');

        // Always paginate for consistent API response
        $widgets = $query
            ->paginate($request->input('per_page', 5))
            ->withQueryString();

        return response()->json($widgets);
    }
}
