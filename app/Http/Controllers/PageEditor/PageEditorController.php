<?php

namespace App\Http\Controllers\PageEditor;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageEditor\PageEditorRequestForm;
use App\Models\PageEditor\DashboardPage;
use App\Models\WidgetEditor\Widget;
use Inertia\Inertia;

class PageEditorController extends Controller
{
    public function index()
    {
        $pages = DashboardPage::all();

        return Inertia::render('PageEditor/PageEditorIndexPage', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        $widgets = Widget::all();

        return Inertia::render('PageEditor/PageEditorCreatePage', [
            'widgets' => $widgets,
        ]);
    }

    public function store(PageEditorRequestForm $request)
    {
        $dashboardPage = DashboardPage::create([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
        ]);

        return redirect()->route('page-editor.index', $dashboardPage);
    }

    public function edit(DashboardPage $pageEditor)
    {
        $widgets = Widget::all();

        return Inertia::render('PageEditor/PageEditorCreatePage', [
            'page' => $pageEditor,
            'widgets' => $widgets,
        ]);
    }

    public function update(PageEditorRequestForm $request, DashboardPage $pageEditor)
    {
        $pageEditor->update([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
        ]);

        return redirect()->route('page-editor.index', $pageEditor);
    }

    public function destroy(DashboardPage $pageEditor)
    {
        $pageEditor->delete();

        return redirect()->route('page-editor.index');
    }
}
