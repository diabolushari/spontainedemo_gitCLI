<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Http\Requests\WidgetEditor\WidgetEditorFormRequest;
use Inertia\Inertia;

class WidgetsEditorController extends Controller
{
    public function index()
    {
        return Inertia::render('WidgetsEditor/WidgetsEditorIndexPage');
    }

    public function create()
    {
        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage');
    }

    public function store(WidgetEditorFormRequest $request)
    {
        dd($request->all());
    }
}
