<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\DataClassificationPropertyFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\DataClassificationProperty;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataClassificationPropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $properties = DataClassificationProperty::query()
            ->when($request->filled('search'), fn($q) => $q->where('property_type', 'like', '%' . $request->search . '%')
                ->orWhere('property_value', 'like', '%' . $request->search . '%'))
            ->orderBy('property_type')
            ->orderBy('order')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('DataClassificationProperty/DataClassificationPropertyIndex', [
            'properties' => $properties,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DataClassificationProperty/DataClassificationPropertyCreate');
    }

    public function store(DataClassificationPropertyFormRequest $request): RedirectResponse
    {
        try {
            DataClassificationProperty::create($request->all());
        } catch (Exception $e) {
            return back()->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()->route('data-classification-property.index')
            ->with(['message' => 'Property created successfully']);
    }

    public function show(DataClassificationProperty $dataClassificationProperty): Response
    {
        return Inertia::render('DataClassificationProperty/DataClassificationPropertyShow', [
            'property' => $dataClassificationProperty,
        ]);
    }

    public function edit(DataClassificationProperty $dataClassificationProperty): Response
    {
        return Inertia::render('DataClassificationProperty/DataClassificationPropertyEdit', [
            'property' => $dataClassificationProperty,
        ]);
    }

    public function update(DataClassificationPropertyFormRequest $request, DataClassificationProperty $dataClassificationProperty): RedirectResponse
    {
        try {
            $dataClassificationProperty->update($request->all());
        } catch (Exception $e) {
            return back()->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()->route('data-classification-property.index')
            ->with(['message' => 'Property updated successfully']);
    }

    public function destroy(DataClassificationProperty $dataClassificationProperty): RedirectResponse
    {
        try {
            $dataClassificationProperty->delete();
        } catch (Exception $e) {
            return back()->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()->route('data-classification-property.index')
            ->with(['message' => 'Property deleted successfully']);
    }
}
