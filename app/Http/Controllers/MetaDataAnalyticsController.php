<?php

namespace App\Http\Controllers;

use App\Models\Meta\MetaData;
use App\Models\Meta\MetaStructure;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class MetaDataAnalyticsController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function index(Request $request): Response
    {
        $structures = MetaStructure::select(['id', 'structure_name'])
            ->get();

        $records = MetaData::with([
            'metaStructure:id,structure_name',
        ])
            ->when($request->filled(key: 'search'), fn(Builder $builder) => $builder->where('name', operator: 'like', value: '%' . $request->input(key: 'search') . '%'))
            ->when($request->filled('structure'), fn(Builder $builder) => $builder->where('meta_structure_id', 'like', $request->input(key: 'structure')))
            ->paginate(20)
            ->withQueryString();
// dd($request->type);
        return Inertia::render('AnalyticsDashboard/MetaDataUi', [
            'metaData' => $records,
            'structures' => $structures,
            'type' => $request->type,
            'subtype' => $request->subtype
        ]);
    }
}
