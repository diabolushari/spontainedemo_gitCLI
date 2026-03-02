<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFindMaxValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SubsetMaxValueController extends Controller
{
    /**
     * @return string[]
     */

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
