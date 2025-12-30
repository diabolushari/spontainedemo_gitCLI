<?php

namespace App\Services\Qdrant;

use App\Services\Embedding\GoogleEmbeddingService;
use Illuminate\Support\Facades\Log;
use Qdrant\Config;
use Qdrant\Http\Builder;
use Qdrant\Qdrant;
use Qdrant\Models\Request\CreateCollection;
use Qdrant\Models\Request\VectorParams;
use Qdrant\Models\PointStruct;
use Qdrant\Models\VectorStruct;
use Qdrant\Models\PointsStruct;
use Qdrant\Models\Request\SearchRequest;
use RuntimeException;

class QdrantService
{
    private Qdrant $client;
    private GoogleEmbeddingService $embeddingService;

    public function __construct(GoogleEmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;

        try {
            $host = config('app.qdrant_host', '127.0.0.1');
            $port = config('app.qdrant_port', 6333);
            $apiKey = config('app.qdrant_api_key');

            // Build the URL correctly
            $url = $host . ':' . $port;

            $config = new Config($url);

            if ($apiKey) {
                $config->setApiKey($apiKey);
            }


            $transport = (new Builder())->build($config);
            $this->client = new Qdrant($transport);

        } catch (\Exception $e) {
            Log::error("Failed to initialize Qdrant client: " . $e->getMessage());
            throw new RuntimeException("Could not connect to Vector Database service.");
        }
    }

    public function getClient(): Qdrant
    {
        return $this->client;
    }

    /**
     * Check if the connection to Qdrant is live.
     */
    public function isConnected(): bool
    {
        try {
            $this->client->collections()->list();
            return true;
        } catch (\Exception $e) {
            Log::warning("Qdrant health check failed: " . $e->getMessage());
            return false;
        }
    }

    // --- Collection Management ---

    /**
     * Create a new collection.
     * 
     * @return array The raw API response
     */
    public function createCollection(string $name, int $vectorSize = 768, string $distance = VectorParams::DISTANCE_COSINE): array
    {
        // FIX: Wrap VectorParams in CreateCollection request object
        $createCollection = new CreateCollection();
        $createCollection->addVector(new VectorParams($vectorSize, $distance));

        return $this->client->collections($name)->create($createCollection)->__toArray();
    }

    public function deleteCollection(string $name): array
    {
        return $this->client->collections($name)->delete()->__toArray();
    }

    public function collectionExists(string $name): bool
    {
        try {
            $response = $this->client->collections($name)->info();
            return isset($response['result']);
        } catch (\Exception $e) {
            // 404 means it doesn't exist, other errors might be connection related
            return false;
        }
    }

    // --- Document (Point) Management ---

    /**
     * Add or update a single document.
     * 
     * @param string|array $textOrVector Either the text to embed or a pre-computed vector array.
     */
    public function addDocument(string $collectionName, int|string $id, string|array $textOrVector, array $payload = []): array
    {
        $vector = is_array($textOrVector) ? $textOrVector : $this->embeddingService->embedDocument($textOrVector);

        return $this->addDocuments($collectionName, [
            [
                'id' => $id,
                'vector' => $vector,
                'payload' => $payload
            ]
        ]);
    }

    /**
     * Add or update multiple documents at once.
     * 
     * @param array $documents List of ['id' => ..., 'text' => ..., 'payload' => ...] or ['id' => ..., 'vector' => ..., 'payload' => ...]
     */
    public function addDocuments(string $collectionName, array $documents): array
    {
        if (empty($documents)) {
            return ['status' => 'skipped', 'message' => 'No documents provided'];
        }

        $points = new PointsStruct();

        foreach ($documents as $doc) {
            $vector = $doc['vector'] ?? $this->embeddingService->embedDocument($doc['text']);

            $point = new PointStruct(
                $doc['id'],
                new VectorStruct($vector),
                $doc['payload'] ?? []
            );
            $points->addPoint($point);
        }

        // Return array instead of Response object
        return $this->client->collections($collectionName)->points()->upsert($points)->__toArray();
    }

    /**
     * Delete a single document by ID.
     */
    public function deleteDocument(string $collectionName, int|string $id): array
    {
        return $this->client->collections($collectionName)->points()->delete([$id])->__toArray();
    }

    /**
     * Delete multiple documents by IDs.
     */
    public function deleteDocuments(string $collectionName, array $ids): array
    {
        return $this->client->collections($collectionName)->points()->delete($ids)->__toArray();
    }

    /**
     * Search for similar documents.
     */
    public function search(string $collectionName, string $query, int $limit = 10): array
    {
        $vector = $this->embeddingService->embedQuery($query);

        $searchRequest = new SearchRequest(new VectorStruct($vector));
        $searchRequest->setLimit($limit);

        return $this->client->collections($collectionName)->points()->search($searchRequest)->__toArray();
    }
}
