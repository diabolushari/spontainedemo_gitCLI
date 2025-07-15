<?php

namespace App\Http\Controllers\PageBuilder;

use App\Http\Controllers\Controller;
use App\Models\PageBuilder\PageBuilder;
use Inertia\Inertia;

class CustomPageController extends Controller
{
    public function show($slug)
    {
        $page = PageBuilder::where('url', $slug)->first();

        if (!$page) {
            abort(404, 'Page not found');
        }

        $blocks = $page->blocks()->orderBy('position')->get();

        return Inertia::render('PageBuilder/PagePreview', [
            'page' => $page,
            'blocks' => $blocks,
        ]);
    }
}
