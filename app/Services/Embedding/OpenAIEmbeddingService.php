<?php

namespace App\Services\Embedding;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class OpenAIEmbeddingService implements EmbeddingServiceInterface
{
    private string $apiKey;
    private string $baseUrl;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('app.openai_api_key');
        $this->baseUrl = 'https://api.openai.com/v1/embeddings';
        $this->model = 'text-embedding-3-small';

        if (empty($this->apiKey)) {
            Log::error('OpenAI API Key is missing in configuration.');
            // We might not want to throw exception in constructor if we want the app to boot, 
            // but for this service it's critical.
        }
    }

    /**
     * Embed a single string using OpenAI API.
     * 
     * @param string $text The text to embed
     * @param string $taskType Ignored for OpenAI as it doesn't use task types in the same way as Google
     * @return array<float> The vector embedding
     */
    public function embed(string $text, string $taskType = 'RETRIEVAL_QUERY'): array
    {
        try {
            if (empty($text)) {
                return [];
            }

            if (empty($this->apiKey)) {
                throw new RuntimeException('OpenAI API Key is missing.');
            }

            Log::info("OpenAI Embedding Request", [
                'model' => $this->model,
                'text_length' => strlen($text)
            ]);

            $response = Http::withToken($this->apiKey)
                ->post($this->baseUrl, [
                    'model' => $this->model,
                    'input' => $text,
                ]);

            if ($response->failed()) {
                Log::error('OpenAI Embedding API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new RuntimeException('OpenAI Embedding API failed: ' . $response->body());
            }

            $vector = $response->json('data.0.embedding') ?? [];

            Log::info("OpenAI Embedding Success", [
                'dimension' => count($vector)
            ]);

            return $vector;

        } catch (\Exception $e) {
            Log::error("OpenAI Embedding Service Exception: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Helper for embedding a search query.
     */
    public function embedQuery(string $text): array
    {
        return $this->embed($text);
    }

    /**
     * Helper for embedding a document for storage.
     */
    public function embedDocument(string $text): array
    {
        return $this->embed($text);
    }
}
