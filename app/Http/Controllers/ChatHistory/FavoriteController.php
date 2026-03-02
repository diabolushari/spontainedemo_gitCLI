<?php

namespace App\Http\Controllers\ChatHistory;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory\ChatHistory;
use App\Models\ChatHistory\FavouriteChat;
use App\Services\Qdrant\QdrantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    protected QdrantService $qdrantService;

    public function __construct(QdrantService $qdrantService)
    {
        $this->qdrantService = $qdrantService;
    }

    /**
     * Add a message to favorites - stores in both favourite_chats table and Qdrant.
     */
    public function addFavorite(Request $request, ChatHistory $chatHistory): JsonResponse
    {
        $validated = $request->validate([
            'message_id' => 'required|integer',
            'summary' => 'required|string',
        ]);

        // Check if already favorited
        $existingFavorite = FavouriteChat::where('chat_id', $chatHistory->id)
            ->where('message_id', $validated['message_id'])
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'message' => 'Message is already favorited',
                'data' => $existingFavorite,
            ], 200);
        }

        // Store to favourite_chats table
        $favouriteChat = FavouriteChat::create([
            'chat_id' => $chatHistory->id,
            'message_id' => $validated['message_id'],
            'summary' => $validated['summary'],
        ]);

        // Store to Qdrant
        $this->storeToQdrant($chatHistory, $validated['message_id'], $validated['summary']);

        return response()->json([
            'message' => 'Favorite added successfully',
            'data' => $favouriteChat,
        ], 201);
    }

    /**
     * Remove a message from favorites - deletes from both favourite_chats table and Qdrant.
     */
    public function removeFavorite(ChatHistory $chatHistory, int $messageId): JsonResponse
    {
        $deleted = FavouriteChat::where('chat_id', $chatHistory->id)
            ->where('message_id', $messageId)
            ->delete();

        if ($deleted === 0) {
            return response()->json([
                'message' => 'Favorite not found',
            ], 404);
        }

        // Remove from Qdrant
        $this->removeFromQdrant($chatHistory->id, $messageId);

        return response()->json([
            'message' => 'Favorite removed successfully',
        ], 200);
    }

    /**
     * Store favorite to Qdrant collection.
     */
    protected function storeToQdrant(ChatHistory $chatHistory, int $messageId, string $summary): void
    {
        $collectionName = 'favourite';

        if (!$this->qdrantService->collectionExists($collectionName)) {
            $this->qdrantService->createCollection($collectionName);
        }

        // Create a unique point ID based on chat_id and message_id
        $pointId = $this->generatePointId($chatHistory->id, $messageId);

        // Use the provided summary as the text for embedding
        $text = "Title: " . $chatHistory->title . "\n\nSummary:\n" . $summary;

        Log::info("Storing favorite to Qdrant", [
            'collection' => $collectionName,
            'point_id' => $pointId,
            'chat_history_id' => $chatHistory->id,
            'message_id' => $messageId
        ]);

        $this->qdrantService->addDocument($collectionName, $pointId, $text, [
            'chat_history_id' => $chatHistory->id,
            'message_id' => $messageId,
            'title' => $chatHistory->title,
            'user_id' => $chatHistory->user_id,
            'summary' => $summary,
        ]);

        Log::info("Favorite stored in Qdrant successfully", ['point_id' => $pointId]);
    }

    /**
     * Remove favorite from Qdrant collection.
     */
    protected function removeFromQdrant(int $chatHistoryId, int $messageId): void
    {
        $collectionName = 'favourite';

        if (!$this->qdrantService->collectionExists($collectionName)) {
            return;
        }

        $pointId = $this->generatePointId($chatHistoryId, $messageId);

        Log::info("Removing favorite from Qdrant", [
            'collection' => $collectionName,
            'point_id' => $pointId
        ]);

        try {
            $this->qdrantService->deleteDocument($collectionName, $pointId);
            Log::info("Favorite removed from Qdrant successfully", ['point_id' => $pointId]);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::warning("Failed to delete from Qdrant: " . $e->getMessage());
        }
    }

    /**
     * Generate a unique point ID for Qdrant based on chat_id and message_id.
     */
    protected function generatePointId(int $chatHistoryId, int $messageId): int
    {
        // Combine chat_id and message_id to create a unique ID
        // Using a simple formula: chat_id * 1000000 + message_id
        // This assumes message_id won't exceed 1000000
        return $chatHistoryId * 1000000 + $messageId;
    }
}
