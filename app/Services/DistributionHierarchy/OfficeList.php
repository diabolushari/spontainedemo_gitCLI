<?php

namespace App\Services\DistributionHierarchy;

use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\JoinDataTable;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

readonly class OfficeList
{
    public function __construct(
        private JoinDataTable $joinDataTable
    ) {}

    public function get(DataDetail $dataDetail, ?string $officeLevel = null): ?Builder
    {
        $dateField = 'data_date';

        //check if data_date field is in dateFields
        if (! $dataDetail->dateFields->contains('column', $dateField)) {
            return null;
        }

        $maxDate = DB::table($dataDetail->table_name)
            ->max($dateField);

        $officeLevelFields = [];
        if ($officeLevel != null) {
            $officeLevelFields[] = $officeLevel.'_code';
            $officeLevelFields[] = $officeLevel.'_name';
        }

        //if empty array is passed all fields will be joined
        return $this->joinDataTable->join($dataDetail, $officeLevelFields)
            ->where($dateField, $maxDate);

    }
}
