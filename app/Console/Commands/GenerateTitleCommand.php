<?php

namespace App\Console\Commands;

use App\Models\ChatHistory\ChatHistory;
use App\Services\GeminiService\GeminiService;
use Illuminate\Console\Command;
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

    public function handle(): int
    {
        $geminiService = new GeminiService;

        $chatHistoriesToUpdate = ChatHistory::where('title', 'Chat')->get();
        if ($chatHistoriesToUpdate->isEmpty()) {
            $this->info('No chat history to update');

            return Command::SUCCESS;
        }

        $updatedCount = 0;
        $failedCount = 0;

        foreach ($chatHistoriesToUpdate as $chatHistory) {
            $result = $geminiService->generateTitle($chatHistory->messages);

            if ($result['success']) {
                $chatHistory->update([
                    'title' => $result['text'],
                ]);
                $updatedCount++;
                $this->info("Updated ChatHistory ID: $chatHistory->id");
            } else {
                $this->error("Failed to update ChatHistory ID: $chatHistory->id: {$result['error']}");
                Log::error("GenerateTitleCommand: Failed for ChatHistory ID: $chatHistory->id: {$result['error']}");
                $failedCount++;
            }
        }

        $this->info("Updated: $updatedCount, Failed: {$failedCount}");

        return Command::SUCCESS;
    }
}
