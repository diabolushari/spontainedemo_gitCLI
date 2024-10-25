<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaDataSearchController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request): JsonResponse
    {
        if ($request->search == null) {
            return response()
                ->json();
        }

        $metaData = MetaData::where('name', 'like', "%$request->search%")
            ->joinStructure()
            ->when($request->meta_structure_id, function (Builder $query) use ($request) {
                return $query->where('meta_structure_id', $request->meta_structure_id);
            })
            ->select(['meta_data.id', 'meta_data.name', 'meta_structures.structure_name'])
            ->limit(10)
            ->get();

        return response()
            ->json($metaData);
    }
}
