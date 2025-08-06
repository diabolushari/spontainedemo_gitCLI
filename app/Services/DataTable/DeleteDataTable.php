<?php

namespace App\Services\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

readonly class DeleteDataTable
{
    public function delete(DataDetail $dataDetail): void
    {
        $dataDetail->load('dateFields', 'dimensionFields', 'relationFields');

        // Store foreign key constraints before dropping them
        $foreignKeys = $this->getForeignKeys($dataDetail);

        // Drop indexes on dateFields and foreignIds on dimensionFields
        Schema::table($dataDetail->table_name, function (Blueprint $table) use ($dataDetail) {
            foreach ($dataDetail->dateFields as $dateField) {
                $table->dropIndex(
                    $dataDetail->table_name
                    .'_'
                    .$dateField->column
                    .'_index'
                );
            }

            foreach ($dataDetail->dimensionFields as $dimensionField) {
                $table->dropForeign(
                    $dataDetail->table_name
                    .'_'
                    .$dimensionField->column
                    .'_foreign'
                );
                $table->dropIndex(
                    $dataDetail->table_name
                    .'_'
                    .$dimensionField->column
                    .'_foreign'
                );
            }

            // Drop foreign keys from related tables
            foreach ($dataDetail->relationFields as $relation) {
                $table->dropForeign(
                    $dataDetail->table_name
                    .'_'
                    .$relation->column
                    .'_foreign'
                );
                $table->dropIndex(
                    $dataDetail->table_name
                    .'_'
                    .$relation->column
                    .'_foreign'
                );
            }
        });

        $dataDetail->delete();

        if (Schema::hasTable($dataDetail->table_name)) {
            $archivedTableName = 'archived_'.time().'_'.$dataDetail->table_name;
            Schema::rename($dataDetail->table_name, $archivedTableName);

            Schema::table($archivedTableName, function (Blueprint $table) use ($foreignKeys, $archivedTableName) {
                foreach ($foreignKeys as $foreignKey) {
                    $column = $foreignKey['column'];

                    $indexName = 'idx_'.hash('crc32b', "{$archivedTableName}_{$column}");

                    $foreignName = 'fk_'.hash('crc32b', "{$archivedTableName}_{$column}");

                    $table->index($column, $indexName);
                    $table->foreign($column, $foreignName)
                        ->references('id')
                        ->on($foreignKey['related_table']);
                }
            });
        }
    }

    /**
     * Get all foreign key constraints for the table
     *
     * @return array<array{column: string, related_table: string}>
     */
    private function getForeignKeys(DataDetail $dataDetail): array
    {
        $foreignKeys = [];

        // Add dimension foreign keys
        foreach ($dataDetail->dimensionFields as $dimensionField) {
            $foreignKeys[] = [
                'column' => $dimensionField->column,
                'related_table' => 'meta_data',
            ];
        }

        // Add relation foreign keys
        foreach ($dataDetail->relationFields as $relation) {
            $relatedTable = DataDetail::find($relation->related_table_id);
            if ($relatedTable) {
                $foreignKeys[] = [
                    'column' => $relation->column,
                    'related_table' => $relatedTable->table_name,
                ];
            }
        }

        return $foreignKeys;
    }
}
