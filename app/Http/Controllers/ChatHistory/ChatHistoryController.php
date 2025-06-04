<?php

namespace App\Http\Controllers\ChatHistory;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use http\Env\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatHistoryController extends Controller
{

    public function show(Request $request, ChatHistory $chatHistory): JsonResponse
    {
        return response()->json($chatHistory);

    }
    public function update(Request $request, ChatHistory $chatHistory): JsonResponse
    {
        $validated = $request->validate([
            'messages' => 'required|array',
            'title' => 'sometimes|string|max:255',
        ]);

        $messages[] = $validated['messages'];

        $chatHistory->update([
        'messages' => $messages,
        'title' => $validated['title'] ?? $chatHistory->title ?? 'New Session',
    ]);

    return response()->json([
        'message' => 'Message updated',
        'data' => $chatHistory
    ], 200);
}
    public function destroy(ChatHistory $chatHistory): JsonResponse
    {
        $chatHistory->delete();

        return response()->json([
            'message' => 'Chat History deleted',
        ]);
    }
}
