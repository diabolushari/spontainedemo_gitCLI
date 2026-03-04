<?php

namespace App\Services\DataLoader\ImportToDataTable;

use Spatie\LaravelData\Data;

class TableColumnInfo extends Data
{
    public function __construct(
        public string $column,
        public string $fieldName,
        public bool $isMetaData = false,
        public ?int $metaStructureId = null,
        public string $type = 'text',
    ) {}
}
