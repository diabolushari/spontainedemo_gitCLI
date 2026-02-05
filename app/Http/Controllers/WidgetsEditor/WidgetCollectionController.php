<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\WidgetCollection;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WidgetCollectionController extends Controller
{
    public function index()
    {
        // Fetch all collections with widget count
        $collections = WidgetCollection::where('user_id', auth()->id())
            ->withCount('widgets')
            ->latest('updated_at')
            ->get();

        // Fetch all widgets with their collection (paginated)
        $widgets = Widget::whereHas('collection', function ($query) {
            $query->where('user_id', auth()->id());
        })
            ->with('collection')
            ->latest('updated_at')
            ->paginate(5);

        return Inertia::render('WidgetsEditor/WidgetCollectionIndexPage', [
            'collections' => $collections,
            'widgets' => $widgets,
        ]);
    }

    public function show(WidgetCollection $widgetCollection)
    {
        // Eager load widgets relationship to avoid N+1 queries
        $widgetCollection->load('widgets');

        return Inertia::render('WidgetsEditor/WidgetCollectionShowPage', [
            'collection' => $widgetCollection,
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
            ->with(['message' => 'Collection created successfully']);
    }

    public function update(Request $request, WidgetCollection $widgetCollection)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);
        $widgetCollection->update($validated);

        return redirect()->route('widget-collection.show', $widgetCollection)
            ->with(['message' => 'Collection updated successfully']);
    }

    public function destroy(WidgetCollection $widgetCollection)
    {
        $widgetCollection->delete();

        return redirect()->route('widget-collection.index')
            ->with(['message' => 'Collection deleted successfully']);
    }
}
