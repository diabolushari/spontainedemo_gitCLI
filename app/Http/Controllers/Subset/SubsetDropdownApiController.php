<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubsetDropdownApiController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request, DistributionHierarchy $findDistributionLevel)
    {
       
        return  $findDistributionLevel->findAllSection(Auth::user()->office_code);
    }
}
