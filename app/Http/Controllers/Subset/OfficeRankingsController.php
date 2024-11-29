<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use Illuminate\Routing\Controllers\HasMiddleware;

class OfficeRankingsController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetGroup $subsetGroup)
    {
        return $subsetGroup;
    }
}
