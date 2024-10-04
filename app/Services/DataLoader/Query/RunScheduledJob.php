<?php

namespace App\Services\DataLoader\Query;

use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataLoader\DataLoaderJobStatus;
use App\Services\DataLoader\Connection\RunLoaderQuery;
use App\Services\DataLoader\ImportToDataTable\ImportToDataTable;
use Exception;
use Illuminate\Support\Facades\Log;

readonly class RunScheduledJob
{
    public function __construct(
        private RunLoaderQuery $runQuery,
        private ImportToDataTable $importToDataTable
    ) {}

    /**
     * @throws Exception
     */
    public function run(
        DataLoaderJob $dataLoaderJob
    ): OperationResult {

        Log::info('Running scheduled job');

        $startTime = now();

        if (
            $dataLoaderJob->loaderQuery == null
            || $dataLoaderJob->detail == null
            || $dataLoaderJob->loaderQuery->loaderConnection == null
        ) {
            return OperationResult::from([
                'error' => true,
                'message' => 'Data loader job has either no query, no data table or no connection',
            ]);
        }

        try {
            $data = $this->runQuery->runQuery(
                $dataLoaderJob->loaderQuery->loaderConnection,
                $dataLoaderJob->loaderQuery,
            );
        } catch (Exception $exception) {

            DataLoaderJobStatus::create([
                'executed_at' => $startTime,
                'completed_at' => now(),
                'loader_job_id' => $dataLoaderJob->id,
                'is_successful' => false,
                'error_message' => $exception->getMessage(),
                'total_records' => 0,
            ]);

            return OperationResult::from([
                'error' => true,
                'message' => ExceptionMessage::getMessage($exception),
            ]);
        }

        $result = $this->importToDataTable->importToDataTable(
            $dataLoaderJob->detail,
            $data,
        );

        Log::info($result);

        try {
            DataLoaderJobStatus::create([
                'executed_at' => $startTime,
                'loader_job_id' => $dataLoaderJob->id,
                ...$result,
            ]);
        } catch (Exception $e) {
            return OperationResult::from([
                'error' => true,
                'message' => $e->getMessage(),
            ]);
        }

        //update job status
        return OperationResult::from([
            'error' => false,
            'message' => null,
        ]);
    }
}
