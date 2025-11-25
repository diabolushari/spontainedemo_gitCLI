<?php

namespace App\Http\Controllers\PageEditor;

use App\Http\Controllers\Controller;
use App\Models\PageEditor\DashboardPage;
use App\Models\WidgetEditor\Widget;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CustomPageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function show(string $slug)
    {
        // Load published page by slug
        $page = DashboardPage::query()
            ->where('link', $slug)
            ->where('published', true)
            ->firstOrFail();

        $this->hydratePage($page);

        // Render view (or return JSON)
        return Inertia::render('PageEditor/CustomPage', [
            'page' => $page,
        ]);
    }

    public function preview(string $key)
    {
        $data = Cache::get("page_preview_{$key}");

        if (!$data) {
            abort(404, 'Preview expired or not found.');
        }

        $page = new DashboardPage($data);

        // Manually set the page attribute if it wasn't set by constructor (e.g. if not in fillable, but usually forceFill or just setting attributes works)
        // DashboardPage likely has 'page' in fillable or casts.
        // Just to be sure:
        $page->page = $data['page'] ?? [];

        $this->hydratePage($page);

        return Inertia::render('PageEditor/CustomPage', [
            'page' => $page,
        ]);
    }

    private function hydratePage(DashboardPage $page): void
    {
        // Original structure (array-cast on DashboardPage)
        $structure = $page->page ?? [];

        // Collect unique widget IDs from all blocks
        $ids = collect($structure)
            ->flatMap(fn($block) => collect($block['widgets'] ?? [])->pluck('widgetId'))
            ->filter()        // remove nulls
            ->unique()
            ->values();

        // Fetch widgets and index by ID for fast lookup
        $widgets = Widget::query()
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        // Hydrate the layout with resolved widgets
        $hydrated = collect($structure)->map(function ($block) use ($widgets) {
            $block['widgets'] = collect($block['widgets'] ?? [])->map(function ($slot) use ($widgets) {
                $wid = $slot['widgetId'] ?? null;
                $slot['widget'] = $wid ? $widgets->get($wid) : null; // Eloquent model or null

                return $slot;
            })->toArray();

            return $block;
        })->toArray();

        // Replace the page structure for this response only
        $page->setAttribute('page', $hydrated);
    }
}
