<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\WidgetCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WidgetCollectionController extends Controller
{
    public function index()
    {
        // Fetch all collections with widget count optimized using withCount
        // This prevents N+1 queries by adding a subquery
        $collections = WidgetCollection::withCount('widgets')
            ->latest('updated_at')
            ->get();

        return Inertia::render('WidgetsEditor/WidgetCollectionIndexPage', [
            'collections' => $collections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $collection = WidgetCollection::create($validated);

        return redirect()->route('widget-collection.index')
            ->with('success', 'Collection created successfully');
    }
}
