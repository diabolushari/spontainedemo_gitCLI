<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Models\DataTable\DataTableRelation;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class RelationColumnInfo extends Data
{
    public function __construct(
        public FieldMappingData $fieldMapping,
        public DataTableRelation $relation,
    ) {}
}
