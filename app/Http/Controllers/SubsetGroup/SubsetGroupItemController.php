<?php

namespace App\Http\Controllers\SubsetGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubsetGroup\SubsetGroupItemRequest;
use App\Libs\ExceptionMessage;
use App\Models\SubsetGroup\SubsetGroupItem;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetGroupItemController extends Controller implements HasMiddleware
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

    public function store(SubsetGroupItemRequest $request): RedirectResponse
    {
        try {
            SubsetGroupItem::create($request->all());
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Subset Group created successfully',
        ]);
    }

    public function update(SubsetGroupItemRequest $request, SubsetGroupItem $subsetGroupItem): RedirectResponse
    {
        try {
            $subsetGroupItem->update($request->all());
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Subset Group updated successfully',
        ]);
    }

    public function destroy(SubsetGroupItem $subsetGroupItem): RedirectResponse
    {
        try {
            $subsetGroupItem->delete();
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Subset Group deleted successfully',
        ]);
    }
}
