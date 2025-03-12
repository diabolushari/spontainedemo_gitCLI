<?php

namespace App\Services\SubsetDocumentGenerator;

use App\Models\Subset\SubsetDetail;

class SubsetDocumentationGenerator
{
    public function generate()
    {
        $subsets = SubsetDetail::whereHas('dimensions', function ($query) {
            $query->whereNotNull('description');
        })
            ->whereHas('measures', function ($query) {
                $query->whereNotNull('description');
            })
            ->get();

        $documentation = '';

        foreach ($subsets as $subset) {
            $documentation = $documentation."- Subset Short Description: \n";
            $documentation .= 'Name =  '.$subset->name."\n";
            $documentation .= 'dataset_id = '.$subset->id."\n";
            $documentation .= 'Primary Dimensional Hierarchy =  '."Office Hierarchy\n";

            $documentation = $documentation."- Subset Description: \n";

            $documentation = $documentation."\t\t $subset->description\n";

        }

        return $documentation;
    }
}
