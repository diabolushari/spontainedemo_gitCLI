<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigOverviewChartUpdateController extends Controller
{

    public function __invoke(BlocksConfigOverviewChartUpdateRequest $request, $id): RedirectResponse
    {

        return redirect()->back();
    }
}
