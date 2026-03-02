<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Libs\ExceptionMessage;
use Throwable;

class SubsetDuplicateController extends Controller implements HasMiddleware
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

    /**
     * @throws Throwable
     */
    public function __invoke(SubsetDetail $subsetDetail): RedirectResponse
    {
        Log::info('Duplicating subset: '.$subsetDetail->id);
        DB::beginTransaction();

        try {
            $user = request()->user()?->id;

            // Replicate the subset detail
            $newSubset = $subsetDetail->replicate();
            $newSubset->name = $subsetDetail->name.' (Copy)';
            $newSubset->created_by = $user;
            $newSubset->updated_by = $user;
            $newSubset->save();

            // Replicate related dates
            foreach ($subsetDetail->dates as $date) {
                $newDate = $date->replicate();
                $newDate->subset_detail_id = $newSubset->id;
                $newDate->created_by = $user;
                $newDate->updated_by = $user;
                $newDate->save();
            }

            // Replicate related dimensions
            foreach ($subsetDetail->dimensions as $dimension) {
                $newDimension = $dimension->replicate();
                $newDimension->subset_detail_id = $newSubset->id;
                $newDimension->created_by = $user;
                $newDimension->updated_by = $user;
                $newDimension->save();
            }

            // Replicate related measures
            foreach ($subsetDetail->measures as $measure) {
                $newMeasure = $measure->replicate();
                $newMeasure->subset_detail_id = $newSubset->id;
                $newMeasure->created_by = $user;
                $newMeasure->updated_by = $user;
                $newMeasure->save();
            }

            DB::commit();

            

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with([
                    'error' => ExceptionMessage::getMessage($e),
                ]);
        }

        return to_route('subset.edit', ['subsetDetail' => $newSubset->id])
                ->with([
                    'message' => 'Subset duplicated successfully',
                ]);
    }
}
