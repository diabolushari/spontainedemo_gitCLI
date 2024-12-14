<?php

namespace App\Http\Controllers\DistributionHierarchy;

use App\Http\Controllers\Controller;
use App\Services\DistributionHierarchy\CachedOfficeLIst;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

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

    public function __invoke(CachedOfficeLIst $cachedOfficeLIst, Request $request): JsonResponse
    {

        if (! $request->filled('search')) {
            return response()
                ->json();
        }

        /** @var array<int, object{office_code: string, office_name: string, level: string}> $records */
        $records = $cachedOfficeLIst->getList();

        $filtered = [];

        $matchedRecords = 0;
        foreach ($records as $record) {
            if ($matchedRecords >= 10) {
                break;
            }
            if (str_contains(strtolower($record['office_name']), strtolower($request['search']))) {
                $filtered[] = [
                    'office_name' => $record['office_name'].' ('.$record['level'].')',
                    'office_code' => $record['office_code'],
                ];
                $matchedRecords++;
            }
        }

        return response()
            ->json($filtered);
    }
}
