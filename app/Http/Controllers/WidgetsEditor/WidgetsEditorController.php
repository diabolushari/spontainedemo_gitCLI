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
        ]);
    }

    public function store(WidgetEditorFormRequest $request)
    {
        $widget = Widget::create($request->toArray());

        return to_route('widget-collection.show', [
            'widgetCollection' => $request->collectionId,
        ])
            ->with('success', 'Widget created successfully');
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
        ]);
    }

    public function update(WidgetEditorFormRequest $request, Widget $widget)
    {

        $widget->update($request->toArray());

        return to_route('widget-collection.show', ['widgetCollection' => $widget->collection_id])
            ->with('success', 'Widget updated successfully');
    }

    public function destroy(Widget $widget)
    {
        $collectionId = $widget->collection_id;
        $widget->delete();

        return to_route('widget-collection.show', ['widgetCollection' => $collectionId])->with('success', 'Widget deleted successfully');
    }
}
