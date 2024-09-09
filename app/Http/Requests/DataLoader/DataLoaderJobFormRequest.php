<?php

namespace App\Http\Requests\DataLoader;

use App\Services\DataLoader\CronTypes;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataLoaderJobFormRequest extends Data
{
    public function __construct(
        public string $name,
        public string $cronType,
        public ?string $startDate,
        public ?string $endDate,
        public ?string $scheduleTime,
        public ?string $dayOfWeek,
        public ?string $monthOfYear,
        public ?string $dayOfMonth,
        public int $queryId,
        public int $dataDetailId,
    ) {
        //
    }

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'cronType' => ['required', 'string', 'max:255'],
            'startDate' => ['nullable', 'date'],
            'endDate' => ['nullable', 'date', 'after_or_equal:startDate'],
            'scheduleTime' => [
                'nullable',
                'required_if:cronType,'.CronTypes::DAILY,
                'required_if:cronType,'.CronTypes::WEEKLY,
                'required_if:cronType,'.CronTypes::MONTHLY,
                'required_if:cronType,'.CronTypes::YEARLY,
            ],
            'dayOfWeek' => [
                'nullable',
                'string',
                'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'required_if:cronType,'.CronTypes::WEEKLY,
            ],
            'monthOfYear' => ['nullable', 'integer', 'min:1', 'max:12', 'required_if:cronType,'.CronTypes::YEARLY],
            'dayOfMonth' => [
                'nullable',
                'integer',
                'min:1',
                'max:31',
                'required_if:cronType,'.CronTypes::MONTHLY,
                'required_if:cronType,'.CronTypes::YEARLY,
            ],
            'queryId' => ['required', 'int', 'exists:loader_queries,id'],
            'dataDetailId' => ['required', 'int', 'exists:data_details,id'],
        ];
    }
}
