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
        $userId = auth()->id();
        $currentSession = ChatHistory::create([
            'user_id' => $userId,
            'title' => 'Chat',
            'messages' => [],
        ]);
        $chatHistory = ChatHistory::where('user_id', $userId)->select('id', 'title', 'created_at')->orderBy('created_at', 'desc')->take(10)->get();
        foreach ($chatHistory as $chat) {
            $chat->timestamp = $chat->created_at->diffForHumans();
        }

        return Inertia::render('Chat/ChatIndexPage', [
            'chatHistory' => $chatHistory,
            'currentSession' => $currentSession,
            'chatToken' => config('app.chat_token'),
            'chatURL' => config('app.chat_url'),
            'agentURL' => config('app.agent_url'),
        ]);
    }
}
