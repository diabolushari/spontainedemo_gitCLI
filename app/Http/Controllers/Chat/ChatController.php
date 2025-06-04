<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
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
        $userId =  auth()->id();
        $chatHistory = ChatHistory::where('user_id', $userId)->select('id', 'title', 'created_at')->orderBy('created_at', 'desc')->take(7)->get();
        $currentSession = ChatHistory::create([
            'user_id' => $userId,
            'title' => 'Chat',
            'messages' => [],
        ]);


        return Inertia::render('Chat/ChatIndexPage', [
            'chatHistory' => $chatHistory,
            'currentSession' => $currentSession,
            'chatToken' => config('app.chat_token'),
            'chatURL' => config('app.chat_url'),
            'agentURL' => config('app.agent_url'),
        ]);
    }
}
