<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaGroupDeleteItemRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaGroupItem;
use Exception;
use Illuminate\Http\RedirectResponse;

class MetaGroupDeleteItemController extends Controller
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

    public function __invoke(MetaGroupDeleteItemRequest $request): RedirectResponse
    {
        // Check if data exists
         $metaGroupItem = MetaGroupItem::where('meta_group_id', $request->metaGroupId)
            ->where('meta_data_id', $request->metaDataId)
            ->first();

        if (!$metaGroupItem) {
            return redirect()->back()->with([
                'error' => 'Meta Data not found in this Group',
            ]);
        }

        try {
            $metaGroupItem->delete();
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Meta Data removed from Group',
        ]);
    }
}
