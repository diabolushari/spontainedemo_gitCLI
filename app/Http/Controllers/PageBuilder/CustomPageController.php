<?php

namespace App\Http\Controllers\PageBuilder;

use App\Http\Controllers\Controller;
use App\Models\PageBuilder\PageBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class CustomPageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function show($slug)
    {
        $page = PageBuilder::where('url', $slug)->first();
        $nowDate = now()->format('Y-m-d');
        if ($page->published_at > $nowDate) {
            abort(404, 'Page not found');
        }

        if (! $page) {
            abort(404, 'Page not found');
        }

        $blocks = $page->blocks()->orderBy('position')->get();

        return Inertia::render('PageBuilder/PagePreview', [
            'page' => $page,
            'blocks' => $blocks,
        ]);
    }
}
