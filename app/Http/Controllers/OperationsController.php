<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OperationsController extends Controller
{
      /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }
    public function index(): Response
    {
        return Inertia::render('Operations/OperationsIndexPage');
    }
}
