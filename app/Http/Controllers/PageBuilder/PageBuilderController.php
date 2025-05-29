<?php

namespace App\Http\Controllers\PageBuilder;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageBuilder\PageBuilderFormRequest;
use App\Models\PageBuilder\PageBuilder;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageBuilderController extends Controller

{
    public function index(): Response

    {
        $pages = PageBuilder::paginate(10);

        return Inertia::render('PageBuilder/PageIndex', [
            'page_list' => $pages,
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('PageBuilder/PageCreate');
    }

    public function store(PageBuilderFormRequest $request): RedirectResponse
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

    public function show(Request $request, int $id): Response
    {

        $page = PageBuilder::findOrFail($id);

        return Inertia::render('PageBuilder/PageShow', [
            'page' => $page,
        ]);
    }

    public function edit(Request $request, int $id): Response
    {
        $page = PageBuilder::find($id);
        return Inertia::render('PageBuilder/PageCreate', [
            'page' => $page
        ]);
    }

    public function update(PageBuilderFormRequest $request, int $id): RedirectResponse
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

    public function destroy(int $id): RedirectResponse
    {
        try {
            $page = PageBuilder::findOrFail($id);
            $page->delete();
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }

        return redirect()
            ->route('page-builder.index')
            ->with(['message' => 'Page Builder Deleted Successfully']);
    }
}
