<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;

class InsertItemToDataTable
{
    private ?DataDetail $dataDetail = null;

    private ?array $fieldMapping = null;

    private bool $deleteExistingData = false;

    private ?string $duplicationIdentifierField = null;

    public function __construct(
        private MapColumnsToField $mapColumnsToField,
        private ConvertToDataTable $convertToDataTable,
    ) {}

    public function insert(array $data): void
    {
        if ($this->dataDetail == null) {
            throw new \Exception('Data detail is required');
        }
        if (empty($data)) {
            throw new \Exception('No data to import');
        }

        $fieldInfo = $this->mapColumnsToField->map(
            array_keys($data),
            $this->dataDetail->id,
            $this->fieldMapping
        );

        dd($fieldInfo);

    }

    public function setDataDetail(DataDetail $dataDetail): self
    {
        $this->dataDetail = $dataDetail;

        return $this;
    }

    public function setFieldMapping(?array $fieldMapping): self
    {
        $this->fieldMapping = $fieldMapping;

        return $this;
    }

    public function setDeleteExistingData(bool $deleteExistingData): self
    {
        $this->deleteExistingData = $deleteExistingData;

        return $this;
    }

    public function setDuplicationIdentifierField(?string $duplicationIdentifierField): self
    {
        $this->duplicationIdentifierField = $duplicationIdentifierField;

        return $this;
    }
}
