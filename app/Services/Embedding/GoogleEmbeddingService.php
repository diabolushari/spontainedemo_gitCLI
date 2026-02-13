<?php

namespace App\Services\Embedding;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GoogleEmbeddingService implements EmbeddingServiceInterface
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        // Using config('app.gemini_api_key') as requested
        $this->apiKey = config('app.gemini_api_key');

        if (empty($this->apiKey)) {
            throw new RuntimeException('Gemini API Key is missing in configuration.');
        }

        // The endpoint for the text-embedding-004 model
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent';
    }

    /**
     * Embed a single string (Query or Document).
     * 
     * @param string $text The text to embed
     * @param string $taskType 'RETRIEVAL_QUERY' for search queries, 'RETRIEVAL_DOCUMENT' for storage
     * @return array<float> The vector embedding
     */
    public function embed(string $text, string $taskType = 'RETRIEVAL_QUERY'): array
    {
        try {
            if (empty($text)) {
                return [];
            }

            // Google API Request Structure
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}?key={$this->apiKey}", [
                        'model' => 'models/text-embedding-004',
                        'content' => [
                            'parts' => [
                                ['text' => $text]
                            ]
                        ],
                        'taskType' => $taskType
                    ]);

            if ($response->failed()) {
                Log::error('Google Embedding API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new RuntimeException('Google Embedding API failed.');
            }

            // Extract the vector from the response
            // Structure: ['embedding' => ['values' => [...]]]
            return $response->json('embedding.values') ?? [];

        } catch (\Exception $e) {
            Log::error("Embedding Service Exception: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Helper for embedding a search query.
     */
    public function embedQuery(string $text): array
    {
        return $this->embed($text, 'RETRIEVAL_QUERY');
    }

    /**
     * Helper for embedding a document for storage.
     */
    public function embedDocument(string $text): array
    {
        return $this->embed($text, 'RETRIEVAL_DOCUMENT');
    }
}
