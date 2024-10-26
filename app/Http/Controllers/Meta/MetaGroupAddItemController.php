<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaGroupAddItemRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaGroupItem;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaGroupAddItemController extends Controller implements HasMiddleware
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

    public function __invoke(MetaGroupAddItemRequest $request): RedirectResponse
    {

        //check if data is duplicate
        $exists = MetaGroupItem::where('meta_group_id', $request->metaGroupId)
            ->where('meta_data_id', $request->metaDataId)
            ->exists();

        if ($exists) {
            return redirect()->back()->with([
                'error' => 'Meta Data already exists in this Group',
            ]);
        }

        try {
            MetaGroupItem::create([
                'meta_group_id' => $request->metaGroupId,
                'meta_data_id' => $request->metaDataId,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Meta Data added to Group',
        ]);

    }
}
