<?php

namespace App\Http\Controllers\DistributionHierarchy;

use App\Http\Controllers\Controller;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use App\Services\DistributionHierarchy\OfficeList;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class OfficeListController extends Controller implements HasMiddleware
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

    public function __invoke(OfficeList $officeList): JsonResponse
    {

        $dataDetail = $this->getDetail();

        $query = $officeList->get($dataDetail);

        if ($query != null) {
            $selectDimensions = '';
            foreach ($dataDetail->dimensionFields as $dimension) {
                $selectDimensions .= ', '.$dimension->column.'_record.name as '.$dimension->column;
            }
            $query->selectRaw("$dataDetail->table_name.* $selectDimensions");
        }

        return response()
            ->json($query?->get());
    }
}
