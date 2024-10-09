<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\Meta\MetaData;
use Exception;

readonly class SyncColumnMetaData
{
    /**
     * insert new MetaData Entries to table and return id's of all metadata present in structure in format
     *  array('meta_data_name' => meta_data_id)
     *
     *
     * @param  string[]  $values
     * @return array<string, int>
     *
     * @throws Exception
     */
    public function sync(int $structureId, array $values): array
    {

        $uniqueValues = array_unique($values);
        $existingMetaData = MetaData::where('meta_structure_id', $structureId)
            ->get();

        $metaDataMap = [];
        $existingIds = [];

        foreach ($existingMetaData as $meta) {
            $metaDataMap[strtolower($meta->name)] = $meta->id;
            $existingIds[] = $meta->id;
        }

        $newMetaDataRecords = [];
        $currentTime = now()->toDateTimeString();
        foreach ($uniqueValues as $value) {

            if (empty($value)) {
                continue;
            }

            $lowerCaseValue = strtolower($value);

            if (! array_key_exists($lowerCaseValue, $metaDataMap)) {
                $newMetaDataRecords[] = [
                    'name' => $value,
                    'meta_structure_id' => $structureId,
                    'created_at' => $currentTime,
                    'updated_at' => $currentTime,
                ];
            }
        }

        if (empty($newMetaDataRecords)) {
            return $metaDataMap;
        }

        MetaData::insert($newMetaDataRecords);

        $newlyInsertedMetaData = MetaData::whereNotIn('id', $existingIds)
            ->where('meta_structure_id', $structureId)
            ->get();

        foreach ($newlyInsertedMetaData as $meta) {
            $metaDataMap[strtolower($meta->name)] = $meta->id;
        }

        return $metaDataMap;
    }
}
