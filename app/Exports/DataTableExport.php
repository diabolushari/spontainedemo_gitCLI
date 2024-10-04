<?php

namespace App\Exports;

use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;

class DataTableExport implements FromCollection
{
    public function __construct(
        private readonly DataDetail $dataDetail,
        private readonly QueryDataTable $queryDataTable
    ) {}

    /**
     * @return Collection<int, array>
     */
    public function collection(): Collection
    {

        $this->dataDetail->load('dateFields', 'measureFields', 'dimensionFields', 'subjectArea');

        /**
         * @var Collection<int, array{fieldName: string, column: string}> $columns
         */
        $columns = collect();

        $this->dataDetail->dateFields->each(function ($dateField) use (&$columns) {
            $columns[] = [
                'fieldName' => $dateField->field_name,
                'column' => $dateField->column,
            ];
        });

        $this->dataDetail->dimensionFields->each(function ($dimensionField) use (&$columns) {
            $columns[] = [
                'fieldName' => $dimensionField->field_name,
                'column' => $dimensionField->column.'_name',
            ];
        });

        $this->dataDetail->measureFields->each(function ($measureField) use (&$columns) {
            $columns[] = [
                'fieldName' => $measureField->field_name,
                'column' => $measureField->column,
            ];

            $columns[] = [
                'fieldName' => $measureField->unit_field_name ?? '',
                'column' => $measureField->unit_column ?? '',
            ];
        });

        $data = collect();

        $headers = [];
        $columns->each(function ($column) use (&$headers) {
            $headers[] = $column['fieldName'];
        });

        $data->push($headers);

        $this->queryDataTable->query($this->dataDetail->subjectArea->table_name ?? '', $this->dataDetail->id)
            ->orderBy('id')
            ->chunk(10000, function ($records) use (&$data, $columns) {
                $records->each(function ($record) use (&$data, $columns) {
                    $row = [];
                    $columns->each(function ($column) use (&$row, $record) {
                        $row[] = $record->{$column['column']} ?? '';
                    });
                    $data->push($row);
                });
            });

        return $data;
    }
}
