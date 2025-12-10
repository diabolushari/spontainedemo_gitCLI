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
        $metaHierarchy = MetaHierarchy::all();


        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage', [
            'collection_id' => $collectionId,
            'type' => $type,
            'meta_hierarchy' => $metaHierarchy,
            'widget_agent_url' => config('app.widget_agent_url'),
        ]);
    }

    public function store(WidgetEditorFormRequest $request)
    {
        $widget = Widget::create($request->toArray());

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

        $widget->update($request->toArray());

        return to_route('widget-collection.index')
            ->with('success', 'Widget updated successfully');
    }

    public function destroy(Widget $widget)
    {
        $widget->delete();

        return to_route('widget-collection.index')->with('success', 'Widget deleted successfully');
    }
}
