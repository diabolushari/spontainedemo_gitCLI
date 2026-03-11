<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceDeliveryController extends Controller implements HasMiddleware
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
        $isAdmin = Auth::user()->isAdmin();
        if (! $isAdmin) {
            abort(403);
        }

        return Inertia::render('ServiceDelivery/ServiceDeliveryIndexPage');
    }
}
