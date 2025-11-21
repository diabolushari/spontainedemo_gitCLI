<?php

namespace App\Http\Controllers\PageEditor;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageEditor\PageEditorRequestForm;
use App\Models\PageEditor\DashboardPage;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageEditorController extends Controller
{
    public function index(): Response
    {
        $pages = DashboardPage::all();

        return Inertia::render('PageEditor/PageEditorIndexPage', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {

        $widgets = Widget::latest()->take(10)->get();

        return Inertia::render('PageEditor/PageEditorCreatePage', [
            'widgets' => $widgets,
        ]);
    }

    public function store(PageEditorRequestForm $request): RedirectResponse
    {
        $dashboardPage = DashboardPage::create([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
            'anchor_widget' => $request->anchor_widget,
        ]);

        return redirect()->route('page-editor.index', $dashboardPage);
    }

    public function edit(DashboardPage $pageEditor): Response
    {
        $pageData = $pageEditor->page ?? [];
        $pageWidgetIds = collect($pageData)
            ->pluck('widgets')
            ->flatten(1)
            ->pluck('widgetId')
            ->filter()
            ->unique();

        $latestWidgets = Widget::latest()->take(5)->get();

        $existingWidgets = Widget::whereIn('id', $pageWidgetIds)->get();

        $latestWidgetIds = $latestWidgets->pluck('id');

        $filteredExistingWidgets = $existingWidgets->filter(fn($widget) => !$latestWidgetIds->contains($widget->id));

        $allWidgets = $latestWidgets->concat($filteredExistingWidgets);

        return Inertia::render('PageEditor/PageEditorCreatePage', [
            'page' => $pageEditor,
            'widgets' => $allWidgets,
        ]);
    }

    public function getWidget(Widget $widget)
    {
        return response()->json($widget);
    }

    public function update(PageEditorRequestForm $request, DashboardPage $pageEditor): RedirectResponse
    {
        $pageEditor->update([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
            'anchor_widget' => $request->anchor_widget,
        ]);

        return redirect()->route('page-editor.index', $pageEditor);
    }

    public function destroy(DashboardPage $pageEditor): RedirectResponse
    {
        $pageEditor->delete();

        return redirect()->route('page-editor.index');
    }

    public function storePreview(Request $request)
    {
        $data = $request->all();
        $key = Str::uuid()->toString();

        Cache::put("page_preview_{$key}", $data, 300); // Store for 5 minutes

        return response()->json([
            'url' => route('page-editor.preview.show', $key),
        ]);
    }
}
