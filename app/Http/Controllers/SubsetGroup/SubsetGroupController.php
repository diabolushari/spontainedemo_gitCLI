<?php

namespace App\Http\Controllers\SubsetGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubsetGroup\SubsetGroupFormRequest;
use App\Http\Requests\SubsetGroup\SubsetGroupSearchRequest;
use App\Libs\ExceptionMessage;
use App\Models\SubsetGroup\SubsetGroup;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class SubsetGroupController extends Controller implements HasMiddleware
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

    public function index(SubsetGroupSearchRequest $request): Response
    {
        /** @var LengthAwarePaginator<SubsetGroup> $subsetGroups */
        $subsetGroups = SubsetGroup::paginate(20)
            ->withQueryString();

        return Inertia::render('SubsetGroup/SubsetGroupIndex', [
            'subsetGroups' => $subsetGroups,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SubsetGroup/SubsetGroupCreate');
    }

    public function store(SubsetGroupFormRequest $request): RedirectResponse
    {
        try {
            /** @var SubsetGroup $record */
            $record = SubsetGroup::create($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('subset-groups.show', $record->id)
            ->with(['message' => 'Data added successfully.']);
    }

    public function show(SubsetGroup $subsetGroup): Response
    {

        $subsetGroup->load('items.subset.dataDetail');

        return Inertia::render('SubsetGroup/SubsetGroupShow', [
            'subsetGroup' => $subsetGroup,
        ]);
    }

    public function edit(SubsetGroup $subsetGroup): Response
    {
        return Inertia::render('SubsetGroup/SubsetGroupCreate', [
            'subsetGroup' => $subsetGroup,
        ]);
    }

    public function update(SubsetGroupFormRequest $request, SubsetGroup $subsetGroup): RedirectResponse
    {

        try {
            $subsetGroup->update($request->all());
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('subset-groups.show', $subsetGroup->id)
            ->with(['message' => 'Record updated successfully.']);
    }

    public function destroy(SubsetGroup $subsetGroup): RedirectResponse
    {
        try {
            $subsetGroup->delete();
        } catch (Exception $e) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($e)]);
        }

        return redirect()
            ->route('subset-groups.index')
            ->with(['message' => 'Record deleted successfully.']);
    }
}
