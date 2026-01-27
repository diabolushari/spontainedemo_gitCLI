<?php

namespace App\Http\Controllers\ChatHistory;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use App\Services\Qdrant\QdrantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatHistoryController extends Controller
{
    protected QdrantService $qdrantService;

    public function __construct(QdrantService $qdrantService)
    {
        $this->qdrantService = $qdrantService;
    }

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

        $oldMessages = $chatHistory->messages ?? [];
        $wasFavorite = $chatHistory->is_favorite;
        $chatHistory->update($validated);

        if (isset($validated['messages'])) {
            $this->handleMessageFavorites($chatHistory, $oldMessages, $validated['messages']);
        }

        if ($chatHistory->is_favorite) {
            $this->syncToQdrant($chatHistory);
        } elseif ($wasFavorite) {
            $this->removeFromQdrant($chatHistory);
        }

        return response()->json([
            'message' => 'Message updated',
            'data' => $chatHistory,
        ], 200);
    }

    protected function handleMessageFavorites(ChatHistory $chatHistory, array $oldMessages, array $newMessages): void
    {
        $oldFavoriteIds = [];
        foreach ($oldMessages as $msg) {
            if (!empty($msg['is_favorite']) && isset($msg['id'])) {
                $oldFavoriteIds[] = $msg['id'];
            }
        }

        foreach ($newMessages as $index => $message) {
            if (!empty($message['is_favorite']) && isset($message['id']) && !in_array($message['id'], $oldFavoriteIds)) {
                // New favorite found
                $this->summarizeAndStoreMessage($chatHistory, $newMessages, $index);
            }
        }
    }

    protected function summarizeAndStoreMessage(ChatHistory $chatHistory, array $messages, int $targetIndex): void
    {
        $targetMessage = $messages[$targetIndex];
        $messageId = $targetMessage['id'];

        // Get messages upto and including the target message
        $messagesToSummarize = array_slice($messages, 0, $targetIndex + 1);

        // Format messages for the summarization API
        $formattedMessages = array_map(function ($message) {
            return [
                'role' => $message['role'] ?? 'user',
                'content' => $message['content'] ?? '',
            ];
        }, $messagesToSummarize);

        try {
            $apiUrl = config('app.chat_summarization_url') . '/chat/summarize';

            $response = Http::timeout(60)->post($apiUrl, [
                'chat_history' => $formattedMessages,
                'summarization_prompt' => 'Provide a concise summary of this conversation.',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $summary = $data['summary'] ?? '';

                $this->storeMessageToQdrant($chatHistory, $messageId, $summary, $messagesToSummarize);
            } else {
                Log::error('Failed to generate summary for message ' . $messageId, [
                    'status' => $response->status(),
                    'details' => $response->json(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error connecting to summarization service: ' . $e->getMessage());
        }
    }

    protected function storeMessageToQdrant(ChatHistory $chatHistory, $messageId, string $summary, array $messages): void
    {
        $collectionName = 'favourite';

        if (!$this->qdrantService->collectionExists($collectionName)) {
            $this->qdrantService->createCollection($collectionName);
        }

        // Composite ID for Qdrant - Deterministic UUID
        $qdrantId = $this->generateMessageFavoriteUuid($chatHistory->id, $messageId);
        $text = "Title: " . $chatHistory->title . "\n\nSummary:\n" . $summary;

        $this->qdrantService->addDocument($collectionName, $qdrantId, $text, [
            'chat_history_id' => $chatHistory->id,
            'message_id' => $messageId,
            'title' => $chatHistory->title,
            'user_id' => $chatHistory->user_id,
            'summary' => $summary,
            'messages' => $messages,
            'type' => 'message_favorite'
        ]);
    }

    protected function generateMessageFavoriteUuid($chatId, $messageId): string
    {
        $hash = md5("chat_{$chatId}_msg_{$messageId}");
        return sprintf(
            '%08s-%04s-%04x-%04x-%12s',
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x4000,
            (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,
            substr($hash, 20, 12)
        );
    }

    public function destroy(ChatHistory $chatHistory): JsonResponse
    {
        if ($chatHistory->is_favorite) {
            $this->removeFromQdrant($chatHistory);
        }

        $chatHistory->delete();

        return response()->json([
            'message' => 'Chat History deleted',
        ]);
    }

    protected function syncToQdrant(ChatHistory $chatHistory): void
    {
        $collectionName = 'favourite';

        if (!$this->qdrantService->collectionExists($collectionName)) {
            $this->qdrantService->createCollection($collectionName);
        }

        $text = "Title: " . $chatHistory->title . "\nHistory:\n";
        $messages = $chatHistory->messages ?? [];
        foreach ($messages as $message) {
            $role = $message['role'] ?? 'unknown';
            $content = $message['content'] ?? (is_string($message) ? $message : json_encode($message));
            $text .= "$role: $content\n";
        }

        $this->qdrantService->addDocument($collectionName, $chatHistory->id, $text, [
            'chat_history_id' => $chatHistory->id,
            'title' => $chatHistory->title,
            'user_id' => $chatHistory->user_id,
            'messages' => $chatHistory->messages,
        ]);
    }

    protected function removeFromQdrant(ChatHistory $chatHistory): void
    {
        $collectionName = 'favourite';
        if ($this->qdrantService->collectionExists($collectionName)) {
            $this->qdrantService->deleteDocument($collectionName, $chatHistory->id);
        }
    }
}
