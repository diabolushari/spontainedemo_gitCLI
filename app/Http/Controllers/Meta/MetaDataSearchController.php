<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataSearchRequest;
use App\Models\Meta\MetaData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class MetaDataSearchController extends Controller
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function __invoke(MetaDataSearchRequest $request): JsonResponse
    {
        if ($request->search == null) {
            return response()
                ->json();
        }

        $metaData = MetaData::where('name', 'like', "%$request->search%")
            ->joinStructure()
            ->when($request->hierarchy != null, function (Builder $query) use ($request) {
                $query->whereHas('hierarchyItem', function (Builder $builder) use ($request) {
                    $builder->where('meta_hierarchy_id', $request->hierarchy);
                });
            })
            ->select(['meta_data.id', 'meta_data.name', 'meta_structures.structure_name'])
            ->limit(10)
            ->get();

        return response()
            ->json($metaData);
    }
}
