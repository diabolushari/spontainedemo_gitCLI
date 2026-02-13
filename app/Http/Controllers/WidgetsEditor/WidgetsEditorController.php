<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Http\Requests\WidgetEditor\WidgetEditorFormRequest;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\Request;
use App\Models\Meta\MetaHierarchy;
use Inertia\Inertia;

class WidgetsEditorController extends Controller
{
    public function index()
    {
        return Inertia::render('WidgetsEditor/WidgetsEditorIndexPage');
    }

    public function create(Request $request)
    {
        $collectionId = $request->get('collection_id');
        $type = $request->get('type');
        $source_query = $request->get('source_query');
        $metaHierarchy = MetaHierarchy::all();


        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage', [
            'collection_id' => $collectionId,
            'type' => $type,
            'source_query' => $source_query,
            'meta_hierarchy' => $metaHierarchy,
            'widget_agent_url' => config('app.widget_agent_url'),
        ]);
    }

    public function store(WidgetEditorFormRequest $request)
    {
        $data = $request->toArray();

        if ($request->saveMode) {
            $collectionName = $request->saveMode;
            $userId = auth()->id();

            if ($request->saveMode === 'community') {
                $userId = null;
            }

            $collection = \App\Models\WidgetEditor\WidgetCollection::firstOrCreate([
                'user_id' => $userId,
                'name' => $collectionName,
            ]);

            // If we found an existing collection, ensure the user owns it (if it's not community)
            if ($collection->user_id !== null && $collection->user_id !== auth()->id()) {
                abort(403, 'Unauthorized to save to this collection');
            }

            $data['collection_id'] = $collection->id;
        }

        $data['user_id'] = auth()->id();

        $widget = Widget::create($data);

        return to_route('widget-collection.index')
            ->with('success', 'Widget created successfully');
    }

    public function show(Widget $widget)
    {
        $widget->load('collection');

        return Inertia::render('WidgetsEditor/WidgetsEditorShowPage', [
            'widget' => $widget,
        ]);
    }

    public function edit(Widget $widget)
    {
        $collectionId = $widget->collection_id;
        $type = $widget->type;
        $metaHierarchy = MetaHierarchy::all();

        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage', [
            'widget' => $widget,
            'collection_id' => $collectionId,
            'type' => $type,
            'meta_hierarchy' => $metaHierarchy,
            'widget_agent_url' => config('app.widget_agent_url'),
        ]);
    }

    public function update(WidgetEditorFormRequest $request, Widget $widget)
    {
        if ($widget->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to update this widget');
        }

        $data = $request->toArray();

        if ($request->saveMode) {
            $collectionName = $request->saveMode;
            $userId = auth()->id();

            if ($request->saveMode === 'community') {
                $userId = null;
            }

            $collection = \App\Models\WidgetEditor\WidgetCollection::firstOrCreate([
                'user_id' => $userId,
                'name' => $collectionName,
            ]);

            // Ensure the user owns the collection (if it's not community)
            if ($collection->user_id !== null && $collection->user_id !== auth()->id()) {
                abort(403, 'Unauthorized to save to this collection');
            }

            $data['collection_id'] = $collection->id;
        }

        $data['user_id'] = auth()->id();

        $widget->update($data);

        return to_route('widget-collection.index')
            ->with('success', 'Widget updated successfully');
    }

    public function destroy(Widget $widget)
    {
        if ($widget->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to delete this widget');
        }

        $widget->delete();

        return to_route('widget-collection.index')->with('success', 'Widget deleted successfully');
    }
}
