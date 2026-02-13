<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WidgetEditor\WidgetEditorFormRequest;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WidgetApiController
{
    /**
     * Store a newly created widget in storage.
     */
    public function store(WidgetEditorFormRequest $request): JsonResponse
    {
        try {
            $data = $request->toArray();

            if ($request->saveMode) {
                $userId = $request->userId ?? auth()->id();
                $collection = \App\Models\WidgetEditor\WidgetCollection::firstOrCreate([
                    'user_id' => $userId,
                    'name' => 'save',
                ]);
                $data['collection_id'] = $collection->id;
            }

            $widget = Widget::create($data);

            return response()->json([
                'message' => 'Widget created successfully',
                'widget' => $widget,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create widget', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->toArray(),
            ]);

            return response()->json([
                'message' => 'Failed to create widget',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified widget in storage.
     */
    public function update(WidgetEditorFormRequest $request, Widget $widget): JsonResponse
    {
        try {
            $data = $request->toArray();

            if ($request->saveMode) {
                $userId = $request->userId ?? auth()->id();
                $collection = \App\Models\WidgetEditor\WidgetCollection::firstOrCreate([
                    'user_id' => $userId,
                    'name' => $request->saveMode === 'save' ? 'save' : 'draft',
                ]);
                $data['collection_id'] = $collection->id;
            }

            $widget->update($data);

            return response()->json([
                'message' => 'Widget updated successfully',
                'widget' => $widget->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update widget', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'widget_id' => $widget->id,
                'request_data' => $request->toArray(),
            ]);

            return response()->json([
                'message' => 'Failed to update widget',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
