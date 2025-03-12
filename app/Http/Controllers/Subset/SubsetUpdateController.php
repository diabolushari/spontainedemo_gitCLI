<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subset\SubsetFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Subset\SubsetDetail;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetUpdateController extends Controller implements HasMiddleware
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
        SubsetFormRequest $request
    ): RedirectResponse {
        try {
            $subsetDetail->update($request->all());
        } catch (Exception $exception) {
            return redirect()
                ->back()
                ->with([
                    'error' => ExceptionMessage::getMessage($exception),
                ]);
        }

        return redirect()
            ->route('subset.preview', $subsetDetail->id)
            ->with([
                'message' => 'Subset updated successfully',
            ]);
    }
}
