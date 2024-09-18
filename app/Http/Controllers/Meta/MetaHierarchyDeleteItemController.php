<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaHierarchyItem;
use Exception;
use Illuminate\Http\RedirectResponse;

class MetaHierarchyDeleteItemController extends Controller
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(string $id): RedirectResponse
    {
        try {
            MetaHierarchyItem::destroy($id);
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Meta Data removed from Hierarchy',
        ]);
    }
}
