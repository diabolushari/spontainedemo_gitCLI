<?php

namespace App\Http\Controllers\SubsetDocumentation;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaData;
use App\Models\Subset\SubsetDetail;

class SubsetDocumentationController extends Controller
{
    public function __invoke()
    {
        $subsets = SubsetDetail::where('use_for_training_ai', 1)
            ->with([
                'dates',
                'dimensions' => function ($query) {
                    $query->whereNot('subset_column', 'section_code');
                },
                'dimensions.info',
                'measures',
                'dataDetail',
            ])
            ->get();

        $documentation = [];

        foreach ($subsets as $subset) {

            $documentation[] = [
                'name' => $subset->name,
                'id' => $subset->id,
                'description' => $subset->description,
                'hierarchy' => 'Office Hierarchy',
                'data_family' => $subset->dataDetail?->name,
                'data_family_description' => $subset->dataDetail?->description,
                'proactive_insight_instructions' => $subset->proactive_insight_instructions,
                'visualization_instructions' => $subset->visualization_instructions,
                'dates' => $subset->dates->map(function ($date) {
                    return [
                        'column' => $date->subset_column,
                        'name' => $date->subset_field_name,
                        'description' => $date->description,
                    ];
                })->toArray(),
                'dimensions' => $subset->dimensions->filter(function ($dimension) {
                    return $dimension->subset_column != 'section_code';
                })
                    ->map(function ($dimension) {
                        return [
                            'column' => $dimension->subset_column,
                            'name' => $dimension->subset_field_name,
                            'description' => $dimension->description,
                            'values' => MetaData::where('meta_structure_id', $dimension->info?->meta_structure_id)
                                ->pluck('name'),
                        ];
                    })->toArray(),
                'measures' => $subset->measures->map(function ($measure) {
                    return [
                        'column' => $measure->subset_column,
                        'name' => $measure->subset_field_name,
                        'description' => $measure->description,
                        'aggregation' => $measure->aggregation,
                    ];
                }),
            ];

        }

        return response()->json($documentation);
    }
}
