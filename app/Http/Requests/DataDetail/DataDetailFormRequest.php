<?php

namespace App\Http\Requests\DataDetail;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property-read DataCollection<int, DateTimeColumnInfo>|null $datetimes
 * @property-read DataCollection<int, DateColumnInfo>|null $dates
 * @property-read DataCollection<int, DimensionColumnInfo>|null $dimensions
 * @property-read DataCollection<int, MeasureColumnInfo>|null $measures
 * @property-read DataCollection<int, TextColumnInfo>|null $texts
 * @property-read DataCollection<int, RelationColumnInfo>|null $relations
 */
#[MapName(SnakeCaseMapper::class)]
class DataDetailFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Max(1000)]
        public ?string $description,
        #[Max(255)]
        public string $subjectArea,
        #[Max(255)]
        public string $tableName,
        public bool $isActive,
        /** @var DataCollection<int, DateColumnInfo>|null */
        public ?DataCollection $dates,
        /** @var DataCollection<int, DateTimeColumnInfo>|null */
        public ?DataCollection $datetimes,
        /** @var DataCollection<int, DimensionColumnInfo>|null */
        public ?DataCollection $dimensions,
        /** @var DataCollection<int, MeasureColumnInfo>|null */
        public ?DataCollection $measures,
        /** @var DataCollection<int, TextColumnInfo>|null */
        public ?DataCollection $texts,
        /** @var DataCollection<int, RelationColumnInfo>|null */
        public ?DataCollection $relations,
            // Job-related fields
        #[Max(255)]
        public ?string $jobName,
        #[Max(1000)]
        public ?string $jobDescription,
        public ?string $cronType,
        public ?string $startDate,
        public ?string $endDate,
        public ?string $scheduleTime,
        public ?string $dayOfWeek,
        public ?string $monthOfYear,
        public ?int $dayOfMonth,
        public ?string $duplicateIdentificationField,
        public bool $deleteExistingData,
        #[RequiredIf('sourceType', 'sql')]
        public ?int $queryId,
        #[RequiredIf('sourceType', 'api')]
        public ?int $apiId,
        public ?string $sourceType,
        public ?array $fieldMapping,
        public ?string $scheduleStartTime,
        public ?int $subHourInterval,
        public ?int $retries,
        public ?int $retriesInterval,
    ) {
    }

    public static function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function ($validator) {
            $data = $validator->getData();
            
            if (
                isset($data['cron_type'], $data['sub_hour_interval'], $data['retries'], $data['retries_interval']) &&
                $data['cron_type'] === 'subhour' &&
                ($data['retries'] * $data['retries_interval'] >= $data['sub_hour_interval'])
            ) {
                $validator->errors()->add('retries_interval', 'Retry duration (Retries * Interval) must be less than Sub-hour Interval');
            }
        });
    }
}
