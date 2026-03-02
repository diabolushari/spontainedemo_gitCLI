<?php

namespace App\Services\Embedding;

interface EmbeddingServiceInterface
{
    /**
     * Embed a single string (Query or Document).
     * 
     * @param string $text The text to embed
     * @param string $taskType 'RETRIEVAL_QUERY' for search queries, 'RETRIEVAL_DOCUMENT' for storage
     * @return array<float> The vector embedding
     */
    public function embed(string $text, string $taskType = 'RETRIEVAL_QUERY'): array;

    /**
     * Helper for embedding a search query.
     * 
     * @param string $text
     * @return array<float>
     */
    public function embedQuery(string $text): array;

    /**
     * Helper for embedding a document for storage.
     * 
     * @param string $text
     * @return array<float>
     */
    public function embedDocument(string $text): array;
}
