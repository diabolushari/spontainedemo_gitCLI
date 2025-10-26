<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFindMaxValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

final class SubsetMaxValueController extends Controller implements HasMiddleware
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

    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetFindMaxValue $findMaxValue,
        Request $request,
    ): JsonResponse {
        $field = $request->input('field', 'month');

        $maxValue = $findMaxValue->findMaxValue($subsetDetail, $field);

        return response()->json([
            'field' => $field,
            'max_value' => $maxValue?->max_value ?? null,
        ]);
    }
}
