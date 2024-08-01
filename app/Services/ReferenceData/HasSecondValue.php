<?php

namespace App\Services\ReferenceData;

use App\Http\Requests\ReferenceDataRequests\RefDataFormRequest;
use App\Libs\ErrorResponse;
use App\Models\ReferenceData\ReferenceDataParameter;

class HasSecondValue
{
    public function check(RefDataFormRequest $dataFormRequest): ErrorResponse
    {
        $parameter = ReferenceDataParameter::find($dataFormRequest->parameterId);

        if ($parameter == null) {
            return ErrorResponse::from([
                'error' => true,
                'message' => 'Parameter not found',
            ]);
        }

        if ($parameter->has_second_value === 1
            && $dataFormRequest->valueTwo === null) {
            return ErrorResponse::from([
                'error' => true,
                'message' => 'Second value is required',
            ]);
        }

        return ErrorResponse::from([
            'error' => false,
            'message' => null,
        ]);
    }
}
