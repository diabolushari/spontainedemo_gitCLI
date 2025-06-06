<?php

namespace App\Console\Commands;

use App\Models\ChatHistory\ChatHistory;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateTitleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-title-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a title for chat history';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $GeminiApiKey = config('app.gemini_api_key');
        $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
        $systemPrompt = "For the given history array generate a title for the history. Only give the title nothing else.\nHistory: ";

        $chatHistoriesToUpdate = ChatHistory::where('title', 'Chat')->get();
        if ($chatHistoriesToUpdate->isEmpty()) {
            $this->info('No chat history to update');

            return Command::SUCCESS;
        }

        $updatedCount = 0;
        $failedCount = 0;

        foreach ($chatHistoriesToUpdate as $chatHistory) {
            $historyString = json_encode($chatHistory->messages);

            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post($apiUrl.$GeminiApiKey, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $systemPrompt.$historyString],
                            ],
                        ],
                    ],
                ]);
                if ($response->successful()) {
                    $title = $response['candidates'][0]['content']['parts'][0]['text'];
                    $chatHistory->update([
                        'title' => $title,
                    ]);
                    $updatedCount++;
                } else {
                    $failedCount++;
                }

            } catch (Exception $e) {
                $this->error("An error occurred while processing ChatHistory ID: {$chatHistory->id}: ".$e->getMessage());
                Log::error("GenerateTitleCommand: Exception for ChatHistory ID: {$chatHistory->id}: ".$e->getMessage());
                $failedCount++;
            }
        }

        return Command::SUCCESS;
    }
}
