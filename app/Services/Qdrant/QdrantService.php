<?php

namespace App\Services\Qdrant;

use App\Services\Embedding\EmbeddingServiceInterface;
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
    private EmbeddingServiceInterface $embeddingService;

    public function __construct(EmbeddingServiceInterface $embeddingService)
    {
        $this->embeddingService = $embeddingService;

        try {
            $host = config('app.qdrant_host', '127.0.0.1');
            $port = config('app.qdrant_port', 6333);
            $apiKey = config('app.qdrant_api_key');

            Log::debug("Initializing Qdrant client", [
                'host' => $host,
                'port' => $port,
                'has_api_key' => !empty($apiKey),
                'api_key_length' => $apiKey ? strlen($apiKey) : 0
            ]);

            // Build the URL correctly
            $url = $host . ':' . $port;

            $config = new Config($url);

            if ($apiKey) {
                $config->setApiKey($apiKey);
            }


            $transport = (new Builder())->build($config);
            $this->client = new Qdrant($transport);

        } catch (\Exception $e) {
            Log::error("Failed to initialize Qdrant client", [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            throw new RuntimeException("Could not connect to Vector Database service: " . $e->getMessage());
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
    public function createCollection(string $name, int $vectorSize = 1536, string $distance = VectorParams::DISTANCE_COSINE): array
    {
        Log::info("Creating Qdrant collection", [
            'name' => $name,
            'vector_size' => $vectorSize,
            'distance' => $distance
        ]);

        try {
            // FIX: Wrap VectorParams in CreateCollection request object
            $createCollection = new CreateCollection();
            $createCollection->addVector(new VectorParams($vectorSize, $distance));

            $response = $this->client->collections($name)->create($createCollection);
            
            Log::debug("Qdrant createCollection raw response", ['response' => $response->__toArray()]);
            
            return $response->__toArray();
        } catch (\Exception $e) {
            Log::error("Qdrant createCollection failed", [
                'collection' => $name,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'exception' => get_class($e)
            ]);
            throw $e;
        }
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
            // 404 is technically not always thrown as an exception by this client depending on config,
            // but if it is, we should only return false if it's actually "not found".
            if ($e->getCode() === 404) {
                return false;
            }
            
            Log::warning("Qdrant collectionExists check encountered an error", [
                'collection' => $name,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'exception' => get_class($e)
            ]);
            
            // If it's 403 or other connection error, we might want to know.
            // For now return false but the log will tell us why.
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
        Log::info("Adding document to Qdrant", [
            'collection' => $collectionName,
            'id' => $id,
            'is_precomputed_vector' => is_array($textOrVector)
        ]);

        $vector = is_array($textOrVector) ? $textOrVector : $this->embeddingService->embedDocument($textOrVector);

        $result = $this->addDocuments($collectionName, [
            [
                'id' => $id,
                'vector' => $vector,
                'payload' => $payload
            ]
        ]);

        Log::info("Qdrant addDocument result", ['id' => $id, 'result' => $result]);
        return $result;
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

        try {
            // Return array instead of Response object
            $response = $this->client->collections($collectionName)->points()->upsert($points);
            return $response->__toArray();
        } catch (\Exception $e) {
            Log::error("Qdrant addDocuments failed", [
                'collection' => $collectionName,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'exception' => get_class($e)
            ]);
            throw $e;
        }
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
        Log::info("Searching Qdrant", [
            'collection' => $collectionName,
            'query_length' => strlen($query),
            'limit' => $limit
        ]);

        try {
            $vector = $this->embeddingService->embedQuery($query);

            $searchRequest = new SearchRequest(new VectorStruct($vector));
            $searchRequest->setLimit($limit);

            $result = $this->client->collections($collectionName)->points()->search($searchRequest)->__toArray();

            Log::info("Qdrant search result count", [
                'collection' => $collectionName,
                'count' => count($result['result'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Qdrant search failed", [
                'collection' => $collectionName,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'exception' => get_class($e)
            ]);
            throw $e;
        }
    }
}
