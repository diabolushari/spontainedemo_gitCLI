<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Models\Subset\SubsetDetail;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetDeleteController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetDetail $detail): RedirectResponse
    {

        try {
            $detail->delete();
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->with([
                    'error' => ExceptionMessage::getMessage($e),
                ]);
        }

        return redirect()
            ->route('data-detail.show', [
                'dataDetail' => $detail->data_detail_id,
                'tab' => 'subset',
            ])
            ->with('success', 'Subset deleted successfully');
    }
}
