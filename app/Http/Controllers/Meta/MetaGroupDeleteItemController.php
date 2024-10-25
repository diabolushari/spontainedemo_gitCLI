<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaGroupItem;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaGroupDeleteItemController extends Controller implements HasMiddleware
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

    public function __invoke(string $id): RedirectResponse
    {
        try {
            MetaGroupItem::destroy($id);
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
