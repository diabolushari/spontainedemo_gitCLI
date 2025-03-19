<?php

namespace App\Services\DataLoader\Query;

use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataLoader\DataLoaderJobStatus;
use App\Services\DataLoader\CronTypes;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\Factory\DataLoaderFactory;
use App\Services\DataLoader\ImportToDataTable\ImportToDataTable;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

readonly class RunScheduledJob
{
    public function __construct(
        private DataLoaderFactory $dataLoaderFactory,
        private ImportToDataTable $importToDataTable,
    ) {}

    /**
     * @throws Exception
     */
    public function run(
        DataLoaderJob $dataLoaderJob
    ): OperationResult {

        Log::info('Starting data loader job: '.$dataLoaderJob->name);

        $startTime = now();

        if (
            $dataLoaderJob->detail == null
        ) {
            return OperationResult::from([
                'error' => true,
                'message' => 'Data loader job has either no query, no data table or no connection',
            ]);
        }

        if ($dataLoaderJob->predecessor != null && ! $this->hasPredecessorFinishedRunning($dataLoaderJob->predecessor)) {
            //check if predecessor has finished
            $errorMessage = 'Predecessor was not finished in time: '.$dataLoaderJob->predecessor->name;
            DataLoaderJobStatus::create([
                'executed_at' => $startTime,
                'completed_at' => now(),
                'loader_job_id' => $dataLoaderJob->id,
                'is_successful' => false,
                'error_message' => $errorMessage,
                'total_records' => 0,
            ]);

            return OperationResult::from([
                'error' => true,
                'message' => $errorMessage,
            ]);
        }

        try {
            if ($dataLoaderJob->loaderQuery != null) {
                $dataSource = DataLoaderSource::fromLoaderSourceModel($dataLoaderJob->loaderQuery);
            }
            if ($dataLoaderJob->api != null) {
                $dataSource = DataLoaderSource::fromLoaderSourceModel($dataLoaderJob->api);
            }
            $data = $this->dataLoaderFactory->createFetcher($dataSource->type)->fetchData($dataSource);
            Log::info($data);
        } catch (Exception|GuzzleException $exception) {
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

        try {
            $result = $this->importToDataTable->importToDataTable(
                $dataLoaderJob->detail,
                $data,
                $dataLoaderJob->delete_existing_data == 1,
                $dataLoaderJob->duplicate_identification_field
            );
        } catch (Exception $exception) {
            $result = [
                'completed_at' => now(),
                'is_successful' => false,
                'error_message' => $exception->getMessage(),
                'total_records' => 0,
            ];
        }

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

    private function hasPredecessorFinishedRunning(DataLoaderJob $predecessor): bool
    {
        $now = now();

        //predecessor should run successfully at least once after below time
        $maxAllowedTime = match ($predecessor->cron_type) {
            CronTypes::HOURLY => $now->copy()->startOfHour()->toDateTimeString(),
            CronTypes::DAILY => $now->copy()->startOfDay()->toDateTimeString(),
            CronTypes::WEEKLY => $now->copy()->startOfWeek()->toDateTimeString(),
            CronTypes::MONTHLY => $now->copy()->startOfMonth()->toDateTimeString(),
            CronTypes::YEARLY => $now->copy()->startOfYear()->toDateTimeString(),
            default => $now->toDateTimeString(),
        };

        return DataLoaderJobStatus::where('is_successful', true)
            ->where('executed_at', '>=', $maxAllowedTime)
            ->where('loader_job_id', $predecessor->id)
            ->exists();
    }
}
