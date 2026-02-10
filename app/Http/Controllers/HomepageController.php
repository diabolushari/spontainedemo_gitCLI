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
            ->whereHas('collection', function ($query) use ($user) {
                $query->where('user_id', $user->id);
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

        return Inertia::render('Homepage/Homepage', [
            'widgets' => $widgets,
            'communityWidgets' => $communityWidgets,
            'pages' => $pages,
            'chatHistory' => $chatHistory,
            'page_agent_url' => $pageAgentUrl,
        ]);
    }
}

