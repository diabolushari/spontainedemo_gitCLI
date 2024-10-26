<?php

namespace App\Http\Controllers\SubjectArea;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectArea\SubjectAreaFormRequest;
use App\Http\Requests\SubjectArea\SubjectAreaUpdateRequest;
use App\Libs\ExceptionMessage;
use App\Models\SubjectArea\SubjectArea;
use App\Services\SubjectArea\CreateDataTable;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

use function request;

class SubjectAreaController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $subjectAreas = SubjectArea::paginate(20)
            ->withQueryString();

        return Inertia::render('SubjectArea/SubjectAreaIndex', [
            'subjectAreas' => $subjectAreas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('SubjectArea/SubjectAreaCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SubjectAreaFormRequest $formRequest, CreateDataTable $createDataTable): RedirectResponse
    {

        try {
            $record = SubjectArea::create([
                ...$formRequest->all(),
                'created_by' => request()->user()->id,
            ]);
        } catch (Exception $exception) {
            Schema::drop($formRequest->tableName);

            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()->route('subject-area.index')
            ->with(['message' => "Subject area $record->name created successfully"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): void {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubjectArea $subjectArea): Response
    {
        return Inertia::render('SubjectArea/SubjectAreaEdit', [
            'subjectArea' => $subjectArea,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SubjectAreaUpdateRequest $formRequest, SubjectArea $subjectArea): RedirectResponse
    {
        try {
            $subjectArea->update([
                ...$formRequest->all(),
                'updated_by' => request()->user()->id,
            ]);

        } catch (Exception $exception) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()->route('subject-area.index')
            ->with(['message' => "Subject area $subjectArea->name updated successfully"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
