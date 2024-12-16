<?php

namespace App\Services\DistributionHierarchy;

use Illuminate\Support\Facades\Cache;

readonly class CachedOfficeLIst
{
    use GetHierarchyTableDetail;

    public function __construct(
        private OfficeList $officeList
    ) {}

    /**
     * @return array{
     *     office_name: string,
     *     level: string,
     *     office_code: string
     * }[]
     */
    public function getList(): array
    {

        $secondsIn3Days = 60 * 60 * 24 * 3;
        $secondsIn7Days = 60 * 60 * 24 * 7;

        return Cache::flexible('office-list', [$secondsIn3Days, $secondsIn7Days], function () {
            $dataDetail = $this->getDetail();
            /** @var array<int, array{office_code: string, office_name: string, level: string}> $allRecords */
            $allRecords = [];

            $levels = ['region', 'circle', 'division', 'subdivision', 'section'];

            foreach ($levels as $level) {
                $query = $this->officeList->get($dataDetail, $level);

                $data = $query?->selectRaw('`'.$level.'_code_record`.`name` as office_code, `'.$level.'_name_record`.`name` as office_name')
                    ->groupByRaw('`'.$level.'_code_record`.`name`, `'.$level.'_name_record`.`name`')
                    ->get()
                    ->toArray() ?? [];

                $allRecords = [
                    ...$allRecords,
                    ...array_map(fn ($record) => [
                        'office_name' => $record->office_name,
                        'level' => $level,
                        'office_code' => $record->office_code,
                    ], $data),
                ];
            }

            return $allRecords;
        });
    }
}
