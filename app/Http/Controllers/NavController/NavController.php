<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NavController extends Controller
{
    public function index()
    {
        return Inertia::render('NavEditor/NavEditorIndexPage');
    }
}
