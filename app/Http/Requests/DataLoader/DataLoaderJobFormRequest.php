<?php

namespace App\Http\Requests\DataLoader;

use App\Services\DataLoader\CronTypes;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataLoaderJobFormRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $description,
        public string $cronType,
        public ?string $startDate,
        public ?string $endDate,
        public ?string $scheduleTime,
        public ?string $dayOfWeek,
        public ?string $monthOfYear,
        public ?int $dayOfMonth,
        public ?string $duplicateIdentificationField,
        #[RequiredIf('sourceType', 'sql')]
        public ?int $queryId,
        #[RequiredIf('sourceType', 'api')]
        public ?int $apiId,
        #[In('sql', 'api')]
        public string $sourceType,
        #[Exists('loader_jobs', 'id')]
        public ?int $predecessorJobId,
        public int $dataDetailId,
        public bool $deleteExistingData
    ) {
        //
    }

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'cron_type' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:startDate'],
            'schedule_time' => [
                'nullable',
                'required_if:cronType,'.CronTypes::DAILY,
                'required_if:cronType,'.CronTypes::WEEKLY,
                'required_if:cronType,'.CronTypes::MONTHLY,
                'required_if:cronType,'.CronTypes::YEARLY,
            ],
            'day_of_week' => [
                'nullable',
                'string',
                'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'required_if:cronType,'.CronTypes::WEEKLY,
            ],
            'month_of_year' => ['nullable', 'integer', 'min:1', 'max:12', 'required_if:cronType,'.CronTypes::YEARLY],
            'day_of_month' => [
                'nullable',
                'integer',
                'min:1',
                'max:31',
                'required_if:cronType,'.CronTypes::MONTHLY,
                'required_if:cronType,'.CronTypes::YEARLY,
            ],
            'data_detail_id' => ['required', 'int', 'exists:data_details,id'],
        ];
    }
}
