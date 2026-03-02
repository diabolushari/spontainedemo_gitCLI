<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use App\Models\ChatHistory\FavouriteChat;
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

    public function __invoke(?ChatHistory $chatHistory = null): Response
    {
        $userId = auth()->id();
        
        if ($chatHistory) {
            if ($chatHistory->user_id !== $userId) {
                abort(403);
            }
            $currentSession = $chatHistory;
        } else {
            $currentSession = ChatHistory::create([
                'user_id' => $userId,
                'title' => 'Chat',
                'messages' => [],
            ]);
        }

        $chatHistory = ChatHistory::where('user_id', $userId)
            ->select('id', 'title', 'created_at', 'is_favorite')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($chatHistory as $chat) {
            $chat->timestamp = $chat->created_at->diffForHumans();
        }

        $favorites = FavouriteChat::with('chatHistory')->get();

        return Inertia::render('Chat/ChatIndexPage', [
            'chatHistory' => $chatHistory,
            'favorites' => $favorites,
            'currentSession' => $currentSession,
            'chatToken' => config('app.chat_token'),
            'chatURL' => config('app.chat_url'),
            'agentURL' => config('app.agent_url'),
            'aiSuggestionUrl' => config('app.ai_suggestion_url'),
            'chatSummarizationUrl' => config('app.chat_summarization_url'),
            'initialMessage' => request()->query('initial_message'),
        ]);
    }
}
