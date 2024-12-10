<?php

namespace App\Http\Controllers\DistributionHierarchy;

use App\Http\Controllers\Controller;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use App\Services\DistributionHierarchy\OfficeList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Cache;

class OfficeSearchController extends Controller implements HasMiddleware
{
    use GetHierarchyTableDetail;

    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(OfficeList $officeList, Request $request): JsonResponse
    {

        $secondsIn3Days = 60 * 60 * 24 * 3;
        $secondsIn7Days = 60 * 60 * 24 * 7;

        if (! $request->filled('search')) {
            return response()
                ->json();
        }

        /** @var array<int, object{office_code: string, office_name: string}> $records */
        $records = Cache::flexible('office-list', [$secondsIn3Days, $secondsIn7Days], function () use ($officeList) {
            $dataDetail = $this->getDetail();
            /** @var array<int, object{office_code: string, office_name: string}> $allRecords */
            $allRecords = [];

            $levels = ['region', 'circle', 'division', 'subdivision', 'section'];

            foreach ($levels as $level) {
                $query = $officeList->get($dataDetail, $level);
                $data = $query?->selectRaw('`'.$level.'_code_record`.`name` as office_code, `'.$level.'_name_record`.`name` as office_name')
                    ->groupByRaw('`'.$level.'_code_record`.`name`, `'.$level.'_name_record`.`name`')
                    ->get() ?? [];
                $allRecords = [
                    ...$allRecords,
                    ...$data,
                ];
            }

            return $allRecords;
        });

        $filtered = [];

        $matchedRecords = 0;
        foreach ($records as $record) {
            if ($matchedRecords >= 10) {
                break;
            }
            if (str_contains(strtolower($record->office_name), strtolower($request->search))) {
                $filtered[] = $record;
                $matchedRecords++;
            }
        }

        return response()
            ->json($filtered);
    }
}
