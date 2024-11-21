<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetListController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    /**
     * Get SubsetDetail with DataDetail name attached to it after joining
     */
    public function __invoke(Request $request): JsonResponse
    {

        $records = SubsetDetail::when($request->filled('search'), function ($query) use ($request) {
            $query->where('subset_details.name', 'like', '%'.$request->search.'%');
        })
            ->leftJoin('data_details', 'subset_details.data_detail_id', '=', 'data_details.id')
            ->limit(10)
            ->orderBy('subset_details.created_at')
            ->selectRaw('subset_details.*, data_details.name as data_detail_name')
            ->get();

        return response()->json($records);

    }
}
