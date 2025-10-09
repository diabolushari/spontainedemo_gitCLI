<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Http\Requests\WidgetEditor\WidgetEditorFormRequest;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\Request;
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

        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage', [
            'collection_id' => $collectionId,
        ]);
    }

    public function store(WidgetEditorFormRequest $request)
    {
        $widget = Widget::create($request->toArray());

        return to_route('widget-collection.show', ['widgetCollection' => $request->collectionId])
            ->with('success', 'Widget created successfully');
    }
}
