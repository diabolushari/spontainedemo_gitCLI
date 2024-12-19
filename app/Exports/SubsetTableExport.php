<?php

namespace App\Exports;

use App\Models\Subset\SubsetDetail;
use App\Services\DataLoader\ImportToDataTable\TableColumnInfo;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

readonly class SubsetTableExport implements FromCollection, ShouldAutoSize
{
    /**
     * @param  object[]  $data
     */
    public function __construct(
        private SubsetDetail $subsetDetail,
        private array $data
    ) {}

    /**
     * @return Collection<int, array<int, string|int|float|null>>
     */
    public function collection(): Collection
    {
        /** @var Collection<int, array<int, string|int|float|null>> $data */
        $data = collect();

        /** @var Collection<int, TableColumnInfo> $fields */
        $fields = collect();
        if (request()->input('excludeNonMeasurements') != '1') {
            $this->subsetDetail->dates->each(function ($date) use (&$fields) {
                $fields->push(new TableColumnInfo(
                    $date->subset_column,
                    $date->subset_field_name
                ));
            });
        }


        if (strtolower(request()->input('level', 'state')) !== 'state') {
            $fields->push(new TableColumnInfo(
                'office_code',
                'Office Code'
            ));
            $fields->push(new TableColumnInfo(
                'office_name',
                'Office Name'
            ));
        }
        if (request()->input('excludeNonMeasurements') != '1') {
            $this->subsetDetail->dimensions->each(function ($dimension) use (&$fields) {
                if ($dimension->filter_only == 1) {
                    return;
                }
                $fields->push(new TableColumnInfo(
                    $dimension->subset_column,
                    $dimension->subset_field_name
                ));
            });
        }

        $this->subsetDetail->measures->each(function ($measure) use (&$fields) {
            $fields->push(new TableColumnInfo(
                $measure->subset_column,
                $measure->subset_field_name
            ));
        });

        //insert title row
        /** @var string[] $titleRow */
        $titleRow = [];
        $fields->each(function ($field) use (&$titleRow) {
            $titleRow[] = $field->fieldName;
        });
        $data->push($titleRow);

        //inset data rows
        foreach ($this->data as $row) {
            /** @var array<int, string|int|float|null> $record */
            $record = [];
            $fields->each(function ($field) use ($row, &$record) {
                $record[] = $row->{$field->column} ?? '';
            });
            $data->push($record);
        }

        return $data;
    }
}
