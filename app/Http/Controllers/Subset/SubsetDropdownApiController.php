<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubsetDropdownApiController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request, DistributionHierarchy $findDistributionLevel)
    {

        return $findDistributionLevel->findAllSection(Auth::user()->office_code);
    }
}
