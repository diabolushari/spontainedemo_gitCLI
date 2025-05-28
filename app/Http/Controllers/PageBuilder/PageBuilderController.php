<?php

namespace App\Http\Controllers\PageBuilder;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageBuilder\PageBuilderFormRequest;
use App\Http\Requests\PageBuilder\PageBuilderRequest;
use App\Models\PageBuilder\PageBuilder;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageBuilderController extends Controller

{
    public function index()

    {
        $pages = PageBuilder::get()->all();

        return Inertia::render('PageBuilder/PageIndex', [
            'pages' => $pages
        ]);
    }

    public function create()
    {

        return Inertia::render('PageBuilder/PageCreate');
    }

    public function store(PageBuilderFormRequest $request)
    {

        try {
            $record = PageBuilder::create($request->all());
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
        return redirect()
            ->route('page-builder.index')
            ->with(['message' => 'Page Builder Created Successfully']);
    }

    public function edit(Request $request, int $id)
    {
        $page = PageBuilder::find($id);
        return Inertia::render('PageBuilder/PageCreate', [
            'page' => $page
        ]);
    }

    public function update(PageBuilderFormRequest $request, int $id)
    {
        try {
            $record = PageBuilder::find($id);
            $record->update([...$request->all()]);
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
        return redirect()
            ->route('page-builder.index')
            ->with(['message' => 'Page Builder Updated Successfully']);
    }
}
