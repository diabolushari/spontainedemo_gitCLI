<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewUpdateRequest;
use Illuminate\Http\RedirectResponse;

class BlocksConfigOverviewUpdateController extends Controller
{

    public function __invoke(BlocksConfigOverviewUpdateRequest $request, $id): RedirectResponse
    {

        return redirect()->back();
    }
}
