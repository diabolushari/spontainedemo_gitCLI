<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller implements HasMiddleware
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

    public function __invoke(): Response
    {
        return Inertia::render('Chat/ChatIndexPage', [
            'chatToken' => config('app.chat_token'),
            'chatURL' => config('app.chat_url'),
        ]);
    }
}
