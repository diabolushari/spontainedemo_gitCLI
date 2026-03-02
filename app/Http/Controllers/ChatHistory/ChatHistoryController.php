<?php

namespace App\Http\Controllers\ChatHistory;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatHistoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 7);

        $chatHistories = ChatHistory::select(['id', 'title', 'is_favorite'])
            ->paginate($perPage);

        return response()->json($chatHistories);
    }

    public function show(Request $request, ChatHistory $chatHistory): JsonResponse
    {
        return response()->json($chatHistory);
    }

    public function update(Request $request, ChatHistory $chatHistory): JsonResponse
    {
        $validated = $request->validate([
            'messages' => 'nullable|array',
            'is_favorite' => 'nullable|boolean',
            'title' => 'nullable|string',
        ]);

        if ($validated === false) {
            return response()->json([
                'message' => 'Validation failed',
            ], 422);
        }

        $chatHistory->update($validated);

        return response()->json([
            'message' => 'Message updated',
            'data' => $chatHistory,
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
