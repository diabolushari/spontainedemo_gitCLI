<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Services\DataTable\QueryDataTable;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class FindLevelController extends Controller
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

    public function __invoke(Request $request, DistributionHierarchy $findDistributionLevel, QueryDataTable $queryDataTable): JsonResponse
    {
        // if request has office_code return information about that office_code
        // instead of returning information about the logged-in user

        $levelInfo = $findDistributionLevel->findLevel(Auth::user()->office_code);

        if ($levelInfo == null) {
            return response()
                ->json([
                    'level' => null,
                    'record' => null,
                ]);
        }

        $dataDetail = $this->getDetail();

        if ($dataDetail === null || ! Schema::hasTable($dataDetail->table_name)) {
            return response()
                ->json([
                    'level' => null,
                    'record' => null,
                ]);
        }

        $record = $queryDataTable->query($dataDetail)
            ->where($levelInfo['levelField'], Auth::user()->office_code)
            ->first();

        return response()
            ->json([
                'level' => $levelInfo['level'],
                'record' => $record,
            ]);

    }
    // public function __invoke(Request $request, DistributionHierarchy $findDistributionLevel)
    // {
    //     // return   $levelInfo = $findDistributionLevel->findLevel(Auth::user()->office_code);
    //     $levelInfo = $findDistributionLevel->findLevel(Auth::user()->office_code);

    //     if ($levelInfo == null) {
    //         return response()
    //             ->json([
    //                 'level' => null,
    //                 'record' => null,
    //             ]);
    //     }

    //     $dataDetail = DataDetail::where('name', TableNames::DISTRIBUTION_HIERARCHY)
    //         ->with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
    //         ->first();

    //     if ($dataDetail === null || ! Schema::hasTable($dataDetail->table_name)) {
    //         return response()
    //             ->json([
    //                 'level' => null,
    //                 'record' => null,
    //             ]);
    //     }

    //     $record = $queryDataTable->query($dataDetail)
    //         ->where($levelInfo['levelField'], Auth::user()->office_code)
    //         ->first();

    //     return response()
    //         ->json([
    //             'level' => $levelInfo['level'],
    //             'record' => $record,
    //         ]);
    // }
}
