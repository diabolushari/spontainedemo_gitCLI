<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class WidgetSearchController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request): JsonResponse
    {
        if (! $request->filled('search')) {
            return response()
                ->json();
        }

        $searchTerm = strtolower($request->input('search'));

        $widgets = Widget::query()
            ->where(function ($query) use ($searchTerm) {
                $query->whereRaw('LOWER(title) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(subtitle) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(type) LIKE ?', ["%{$searchTerm}%"]);
            })
            ->limit(10)
            ->get();

        return response()->json($widgets);
    }
}
