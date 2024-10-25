<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaStructure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaStructureSearchController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request): JsonResponse
    {

        if (! $request->filled('search')) {
            return response()
                ->json();
        }

        $structures = MetaStructure::withCount('metaData')
            ->when($request->filled(key: 'search'), fn (Builder $builder) => $builder
                ->where('structure_name', operator: 'like', value: '%'.$request->input(key: 'search').'%'))->get();

        return response()
            ->json($structures);
    }
}
