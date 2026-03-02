<?php

namespace App\Http\Controllers;

use App\Models\PageEditor\DashboardPage;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomepageController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Fetch user's widgets (limit to 8 for homepage display)
        $widgets = Widget::with('collection')
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhereHas('collection', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->orderBy('updated_at', 'desc')
            ->limit(8)
            ->get();

        // Fetch pages (limit to 6 for homepage display)
        // Currently pages don't have user_id, so we fetch recent ones
        $pages = DashboardPage::orderBy('updated_at', 'desc')
            ->limit(6)
            ->get();

        // Get the page agent URL from config
        $pageAgentUrl = config('services.page_agent.url', 'ws://localhost:8000/api/v1/page-builder-agent');

        // Fetch user's chat history
        $chatHistory = \App\Models\ChatHistory\ChatHistory::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        // Fetch community widgets
        $communityWidgets = Widget::with('collection')
            ->whereHas('collection', function ($query) {
                $query->whereNull('user_id')
                    ->where('name', 'community');
            })
            ->orderBy('updated_at', 'desc')
            ->limit(8)
            ->get();

        // Hydrate pages with widget data
        foreach ($pages as $page) {
            $this->hydratePage($page);
        }

        return Inertia::render('Homepage/Homepage', [
            'widgets' => $widgets,
            'communityWidgets' => $communityWidgets,
            'pages' => $pages,
            'chatHistory' => $chatHistory,
            'page_agent_url' => $pageAgentUrl,
        ]);
    }

    private function hydratePage(DashboardPage $page): void
    {
        // Structure is page content array
        $structure = $page->page ?? [];

        // Collect unique widget IDs from all blocks for this page
        $ids = collect($structure)
            ->flatMap(fn($block) => collect($block['widgets'] ?? [])->pluck('widgetId'))
            ->filter()
            ->unique()
            ->values();

        // Fetch widgets and index by ID for fast lookup
        // Ideally we'd fetch for ALL pages at once, but for 6 pages * avg 5-10 widgets, 
        // 6 queries is acceptable for now given the complexity of grouping/mapping for multiple pages
        // without a relationship.
        $widgets = Widget::query()
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        // Hydrate the layout with resolved widgets
        $hydrated = collect($structure)->map(function ($block) use ($widgets) {
            $block['widgets'] = collect($block['widgets'] ?? [])->map(function ($slot) use ($widgets) {
                $wid = $slot['widgetId'] ?? null;
                $slot['widget'] = $wid ? $widgets->get($wid) : null;
                return $slot;
            })->toArray();

            return $block;
        })->toArray();

        // Replace the page structure for this response only
        $page->setAttribute('page', $hydrated);
    }
}

