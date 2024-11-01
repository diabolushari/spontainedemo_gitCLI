<?php

namespace App\Services\DistributionHierarchy;

use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Support\Facades\Schema;

class DistributionHierarchy
{
    use GetHierarchyTableDetail;

    private ?DataDetail $distributionTable;

    public array $hierarchyLevelFieldMap = [
        [
            'level' => 'section',
            'levelField' => 'section_code_record.name',
        ],
        [
            'level' => 'subdivision',
            'levelField' => 'subdivision_code_record.name',
        ],
        [
            'level' => 'division',
            'levelField' => 'division_code_record.name',
        ],
        [
            'level' => 'circle',
            'levelField' => 'circle_code_record.name',
        ],
        [
            'level' => 'region',
            'levelField' => 'region_code_record.name',
        ],
    ];

    public function __construct(private readonly QueryDataTable $queryDataTable)
    {
        $this->distributionTable = $this->getDetail();
    }

    /**
     * @return array{level: string, levelField: string}|null
     */
    public function findLevel(int|string $officeCode): ?array
    {

        if ($this->distributionTable == null || ! Schema::hasTable($this->distributionTable->table_name)) {
            return null;
        }

        foreach ($this->hierarchyLevelFieldMap as $fieldMapping) {
            $existsInSection = $this->queryDataTable->query($this->distributionTable)
                ->where($fieldMapping['levelField'], $officeCode)
                ->exists();

            if ($existsInSection) {
                return $fieldMapping;
            }
        }

        return null;
    }

    /**
     * @return array<array-key, array<array-key, string|int|float|null>>
     */
    public function findAllSection(int|string $officeCode): array
    {
        $levelInfo = $this->findLevel($officeCode);

        if ($levelInfo == null) {
            return [];
        }

        return $this->queryDataTable->query($this->distributionTable)
            ->where($levelInfo['levelField'], $officeCode)
            ->get()
            ->toArray();

    }
}
