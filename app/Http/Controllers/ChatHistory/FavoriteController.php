<?php

namespace App\Http\Controllers\ChatHistory;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use App\Services\Qdrant\QdrantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FavoriteController extends Controller
{
    protected QdrantService $qdrantService;

    public function __construct(QdrantService $qdrantService)
    {
        $this->qdrantService = $qdrantService;
    }

    /**
     * Summarize chat history up to the last data_fetch action and store to Qdrant.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'chat_history_id' => 'required|exists:chat_histories,id',
        ]);

        $chatHistory = ChatHistory::findOrFail($validated['chat_history_id']);
        $messages = $chatHistory->messages ?? [];

        // Find the last data_fetch action
        $lastDataFetchIndex = null;
        foreach ($messages as $index => $message) {
            if (
                isset($message['role']) &&
                isset($message['content']) &&
                $message['role'] === 'action' &&
                $message['content'] === 'data_fetch'
            ) {
                $lastDataFetchIndex = $index;
            }
        }

        // If no data_fetch action found, return error
        if ($lastDataFetchIndex === null) {
            return response()->json([
                'error' => 'No data_fetch action found in chat history',
            ], 400);
        }

        // Get messages up to and including the last data_fetch action
        $messagesToSummarize = array_slice($messages, 0, $lastDataFetchIndex + 1);

        // Format messages for the summarization API
        $formattedMessages = array_map(function ($message) {
            return [
                'role' => $message['role'] ?? 'user',
                'content' => $message['content'] ?? '',
            ];
        }, $messagesToSummarize);

        try {
            // Call the summarization API
            $apiUrl = config('app.chat_summarization_url') . '/chat/summarize';

            $response = Http::timeout(60)->post($apiUrl, [
                'chat_history' => $formattedMessages,
                'summarization_prompt' => 'Provide a concise summary of this conversation.',
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Failed to generate summary',
                    'details' => $response->json(),
                ], $response->status());
            }

            $data = $response->json();
            $summary = $data['summary'] ?? '';

            // Store to Qdrant favourite collection
            $this->storeToQdrant($chatHistory, $summary);

            // Mark as favorite
            $chatHistory->update(['is_favorite' => true]);

            return response()->json([
                'message' => 'Chat favorited and summary stored',
                'summary' => $summary,
                'message_count' => $data['message_count'] ?? count($formattedMessages),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to connect to summarization service',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    protected function storeToQdrant(ChatHistory $chatHistory, string $summary): void
    {
        $collectionName = 'favourite';

        if (!$this->qdrantService->collectionExists($collectionName)) {
            $this->qdrantService->createCollection($collectionName);
        }

        // Use the AI-generated summary as the text for embedding
        $text = "Title: " . $chatHistory->title . "\n\nSummary:\n" . $summary;

        $this->qdrantService->addDocument($collectionName, $chatHistory->id, $text, [
            'chat_history_id' => $chatHistory->id,
            'title' => $chatHistory->title,
            'user_id' => $chatHistory->user_id,
            'summary' => $summary,
            'messages' => $chatHistory->messages,
        ]);
    }
}
