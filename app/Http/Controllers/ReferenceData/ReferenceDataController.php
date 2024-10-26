<?php

namespace App\Http\Controllers\ReferenceData;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReferenceDataRequests\RefDataFormRequest;
use App\Http\Requests\ReferenceDataRequests\ReferenceDataSearchRequest;
use App\Models\ReferenceData\ReferenceData;
use App\Models\ReferenceData\ReferenceDataDomain;
use App\Services\ReferenceData\HasSecondValue;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class ReferenceDataController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function index(ReferenceDataSearchRequest $searchRequest): Response
    {
        $referenceData = ReferenceData::fullData()
            ->filter($searchRequest)
            ->paginate(20);

        $domains = ReferenceDataDomain::get();

        return Inertia::render('ReferenceData/ReferenceDataIndex', [
            'referenceData' => $referenceData,
            'domains' => $domains,
            'oldDomain' => $searchRequest->domainId ?? '',
            'oldParameter' => $searchRequest->parameterId ?? '',
            'oldValue' => $searchRequest->value ?? '',
        ]);
    }

    public function create(): Response
    {
        $domains = ReferenceDataDomain::get();

        return Inertia::render('ReferenceData/ReferenceDataCreate', [
            'domains' => $domains,
        ]);
    }

    public function store(RefDataFormRequest $request, HasSecondValue $hasSecondValue): RedirectResponse
    {

        $response = $hasSecondValue->check($request);

        if ($response->error) {
            return back()->with([
                'error' => $response->message,
            ]);
        }

        try {
            ReferenceData::create($request->all());
        } catch (Exception $e) {
            return back()->with([
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()
            ->route('reference-data.index')
            ->with([
                'message' => 'Reference Data Added successfully',
            ]);
    }

    public function edit(string $id): Response
    {
        $domains = ReferenceDataDomain::get();

        $referenceData = ReferenceData::findOrFail($id);

        return Inertia::render('ReferenceData/ReferenceDataEdit', [
            'referenceData' => $referenceData,
            'domains' => $domains,
        ]);
    }

    public function update(string $id, RefDataFormRequest $request, HasSecondValue $hasSecondValue): RedirectResponse
    {

        $response = $hasSecondValue->check($request);

        if ($response->error) {
            return back()->with([
                'error' => $response->message,
            ]);
        }

        try {
            ReferenceData::where('id', $id)
                ->update($request->all());
        } catch (Exception $e) {
            return back()->with([
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()
            ->route('reference-data.index')
            ->with([
                'message' => 'Reference Data Updated successfully',
            ]);
    }
}
