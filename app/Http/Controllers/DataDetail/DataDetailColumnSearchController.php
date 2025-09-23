<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class DataDetailColumnSearchController extends Controller implements HasMiddleware
{
    protected $queryDataTable;

    public function __construct(QueryDataTable $queryDataTable)
    {
        $this->queryDataTable = $queryDataTable;
    }

    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request, DataDetail $dataDetail)
    {
        $column = $request->input('column');
        $search = $request->input('search');

        $validDimensions = $dataDetail->dimensionFields->pluck('column')->toArray();
        if (! in_array($column, $validDimensions)) {
            return response()->json(['error' => 'Invalid column for this DataDetail'], 400);
        }

        $query = $this->queryDataTable->query($dataDetail);

        $suggestions = $query->select($column.'_record.name as suggestion')
            ->where($column.'_record.name', 'LIKE', '%'.$search.'%')
            ->distinct()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return ['value' => $item->suggestion];
            })
            ->toArray();

        return response()->json($suggestions);
    }
}
