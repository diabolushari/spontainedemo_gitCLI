<?php

namespace App\Services\DistributionHierarchy;

use App\Models\DataDetail\DataDetail;
use App\Services\TableNames;

trait GetHierarchyTableDetail
{
    private function getDetail(): ?DataDetail
    {
        return DataDetail::where('name', TableNames::DISTRIBUTION_HIERARCHY)
            ->with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->first();
    }
}
