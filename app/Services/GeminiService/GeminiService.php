<?php

namespace App\Services\GeminiService;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;

    private string $baseUrl;

    private string $model;

    public function __construct()
    {
        $this->apiKey = config('app.gemini_api_key');
        $this->baseUrl = config('app.gemini_base_url');
        $this->model = config('app.gemini_model');
    }

    public function generateContent(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? $this->model;
        $url = $this->baseUrl.$model.':generateContent?key='.$this->apiKey;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'text' => $response['candidates'][0]['content']['parts'][0]['text'] ?? null,
                ];
            }

            return [
                'success' => false,
                'error' => 'API request failed',
                'status' => $response->status(),
                'body' => $response->body(),
            ];

        } catch (Exception $e) {
            Log::error('GeminiService: Exception occurred: '.$e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function generateTitle(array $messages): array
    {
        $systemPrompt = "For the given history array generate a title for the history. Only give the title nothing else.\nHistory: ";
        $historyString = json_encode($messages);

        return $this->generateContent($systemPrompt.$historyString);
    }
}
