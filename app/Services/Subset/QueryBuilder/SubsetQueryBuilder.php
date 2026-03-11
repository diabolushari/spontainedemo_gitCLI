<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\DataDetail\DataDetail;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyLevelInfo;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDimension;
use App\Services\DataTable\JoinDataTable;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use App\Services\MetaData\Hierarchy\FlattenHierarchyAtLevel;
use App\Services\MetaData\Hierarchy\HierarchySubQuery;
use App\Services\Subset\SubsetApplyDefaultFilters;
use Illuminate\Database\Query\Builder;

readonly class SubsetQueryBuilder
{
    use FlattenHierarchyAtLevel;
    use GetHierarchyTableDetail;
    use HierarchySubQuery;
    use SubsetApplyDefaultFilters;

    public function __construct(
        private JoinDataTable $joinDataTable,
        private AddDatesToQuery $addDatesToQuery,
        private AddDimensionsToQuery $addDimensionsToQuery,
        private AddMeasuresToQuery $addMeasuresToQuery,
        private AddTextsToQuery $addTextsToQuery
    ) {
    }

    public function query(
        SubsetDetail $subsetDetail,
        bool $isSummary,
        bool $excludeNonMeasurements,
        ?string $summaryLevel,
        ?array $fields,
        ?string $dimension = null
    ): Builder {

        /** @var string[] $groupingColumns */
        $groupingColumns = [];
        /** @var string[] $selectColumns */
        $selectColumns = [];
        /** @var string[] $measureColumns */
        $measureColumns = [];
        /** @var SubsetFieldOrderInfo[] $orderColumns */
        $orderColumns = [];

        if (!$excludeNonMeasurements) {
            $this->addDatesToQuery->addDateFields(
                $subsetDetail->dates,
                $groupingColumns,
                $selectColumns,
                $orderColumns,
                $fields
            );
            $this->addDimensionsToQuery->addDimensionFields(
                $subsetDetail->dimensions,
                $groupingColumns,
                $selectColumns,
                $orderColumns,
                $isSummary,
                $fields
            );
            $this->addTextsToQuery->addTextFields(
                $subsetDetail->texts,
                $groupingColumns,
                $selectColumns,
                $orderColumns,
                $fields
            );
        }

        $this->addMeasuresToQuery->addMeasureFields(
            $subsetDetail->measures,
            $measureColumns,
            $groupingColumns,
            $orderColumns,
            $fields
        );

        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $subsetDetail->data_detail_id)
            ->first();

        $query = $this->joinDataTable->join($detail);

        if (!$isSummary) {
            $this->includeHierarchy(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns,
                $fields
            );
        }

        if ($isSummary) {
            $this->groupByDimension(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns,
                $summaryLevel,
                $dimension
            );
        }

        $selectStatement = implode(',', [
            ...$selectColumns,
            ...$measureColumns,
        ]);

        if ($subsetDetail->group_data == 1 && count($groupingColumns) > 0) {
            $groupByStatement = implode(',', $groupingColumns);
            $query->groupByRaw($groupByStatement);
        }

        $this->filterData($detail, $subsetDetail, $query);

        //if request has limit parameter the use it instead of max_rows_to_fetch
        if ($subsetDetail->max_rows_to_fetch != null || request()->filled('limit')) {
            $limit = request()->input('limit') ?? $subsetDetail->max_rows_to_fetch;
            if (is_numeric($limit)) {
                $query->take($limit);
            }
        }

        foreach ($orderColumns as $order) {
            $query->orderByRaw($order->column . ' ' . $order->sortOrder);
        }

        return $query->selectRaw($selectStatement);
    }

    /**
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function includeHierarchy(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
        ?array $fields
    ): void {
        //if office info is included in the subset then include the hierarchy table
        $subsetDetail->dimensions->each(function ($dimension) use ($query, &$groupingColumns, &$selectColumns, $detail, $subsetDetail, $fields) {
            if ($dimension->hierarchy_id == null || $dimension->filter_only == 1) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && !in_array($dimension->subset_column, $fields)) {
                return;
            }

            $hierarchy = MetaHierarchy::where('id', $dimension->hierarchy_id)
                ->first();

            if ($hierarchy == null) {
                return;
            }
            $this->addHierarchyToQuery(
                $hierarchy,
                $query,
                $dimension,
                $detail,
                (int) $subsetDetail->group_data,
                $groupingColumns,
                $selectColumns,
            );
        });
    }

    /**
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function groupByDimension(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
        ?string $groupingLevel = null,
        ?string $targetDimension = null
    ): void {
        /** @var SubsetDetailDimension $dimensionRecord */
        $dimensionRecord = null;
        //find dimension with hierarchy
        foreach ($subsetDetail->dimensions as $dimension) {
            if ($targetDimension !== null) {
                if ($dimension->subset_column === $targetDimension && $dimension->hierarchy_id != null) {
                    $dimensionRecord = $dimension;
                    break;
                }
            } elseif ($dimension->hierarchy_id != null) {
                $dimensionRecord = $dimension;
            }
        }

        if ($dimensionRecord == null) {
            return;
        }

        $hierarchy = MetaHierarchy::where('id', $dimensionRecord->hierarchy_id)
            ->first();

        if ($hierarchy == null) {
            return;
        }

        $allLevelsInHierarchy = MetaHierarchyLevelInfo::where('meta_hierarchy_id', $dimensionRecord->hierarchy_id)
            ->orderBy('level')
            ->get();

        /** @var MetaHierarchyLevelInfo|null $selectedLevel */
        $selectedLevel = null;
        foreach ($allLevelsInHierarchy as $level) {
            if ($groupingLevel == null) {
                $selectedLevel = $level;
                break;
            }
            if (strtolower($level->name) === strtolower($groupingLevel)) {
                $selectedLevel = $level;
                break;
            }
        }

        if ($selectedLevel == null) {
            return;
        }
        $hierarchyBottomLevel = $allLevelsInHierarchy->max('level');

        $hierarchySubQuery = $this->flatten($hierarchy->id, $hierarchyBottomLevel);

        if ($selectedLevel->level === 1) {
            $query->leftJoinSub(
                $hierarchySubQuery,
                'hierarchy',
                function ($join) use ($detail, $dimensionRecord, $hierarchyBottomLevel) {
                    $join->on(
                        "$detail->table_name." . $dimensionRecord->info->column,
                        '=',
                        "hierarchy.lvl_{$hierarchyBottomLevel}_primary_field"
                    );
                }
            );
        } else {
            $query->joinSub(
                $hierarchySubQuery,
                'hierarchy',
                function ($join) use ($detail, $dimensionRecord, $hierarchyBottomLevel) {
                    $join->on(
                        "$detail->table_name." . $dimensionRecord->info->column,
                        '=',
                        "hierarchy.lvl_{$hierarchyBottomLevel}_primary_field"
                    );
                }
            );
        }

        $query->leftJoin(
            'meta_data as primary_field_record',
            "hierarchy.lvl_{$selectedLevel->level}_primary_field",
            '=',
            'primary_field_record.id'
        )
            ->leftJoin(
                'meta_data as secondary_field_record',
                "hierarchy.lvl_{$selectedLevel->level}_secondary_field",
                '=',
                'secondary_field_record.id'
            );

        $selectColumns[] = "primary_field_record.name as $hierarchy->primary_column";
        if ($subsetDetail->group_data == 1) {
            $groupingColumns[] = 'primary_field_record.name';
        }

        if ($hierarchy->secondary_column != null) {
            $selectColumns[] = "secondary_field_record.name as $hierarchy->secondary_column";
            if ($subsetDetail->group_data == 1) {
                $groupingColumns[] = 'secondary_field_record.name';
            }
        }
    }
}
