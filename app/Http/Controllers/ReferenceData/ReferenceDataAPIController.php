<?php

namespace App\Http\Controllers\ReferenceData;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReferenceDataRequests\CascadedReferenceDataRequest;
use App\Http\Requests\ReferenceDataRequests\DomainParameterSearchRequest;
use App\Models\ReferenceData\ReferenceData;
use App\Models\ReferenceData\ReferenceDataParameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferenceDataAPIController extends Controller
{
    public function parameterList(Request $request): JsonResponse
    {
        if (! $request->filled('domain')) {
            return response()
                ->json();
        }

        $parameters = ReferenceDataParameter::where('domain_id', $request->input('domain'))
            ->get();

        return response()->json($parameters);
    }

    public function uniqueValues(DomainParameterSearchRequest $request): JsonResponse
    {
        $referenceData = ReferenceData::joinedData()
            ->where('parameter.parameter', $request->parameter)
            ->where('domain.domain', $request->domain)
            ->groupBy('value_one')
            ->select('value_one')
            ->get();

        return response()->json($referenceData);

    }

    public function cascadedValues(CascadedReferenceDataRequest $request): JsonResponse
    {
        $referenceData = ReferenceData::joinedData()
            ->where('parameter.parameter', $request->parameter)
            ->where('domain.domain', $request->domain)
            ->where(function ($query) use ($request) {
                $query->where('value_two', $request->searchValue)
                    ->orWhereNull('value_two');
            })
            ->groupBy('value_one')
            ->select('value_one')
            ->get();

        return response()->json($referenceData);
    }
}
