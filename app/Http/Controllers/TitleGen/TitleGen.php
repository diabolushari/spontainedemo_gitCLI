<?php

namespace App\Http\Controllers\TitleGen;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TitleGen extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'history' => 'required|array',
            'history.*.role' => 'required|string',
            'history.*.content' => 'required|string',
            'history.*.timestamp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $GeminiApikey = env('GEMINI_API_KEY');;
        $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
        $systemPrompt = "For the given history array generate a title for the history. Only give the title nothing else.\nHistory: ";
        //$prompt = $request->input('history');
        $history = $request->input('history');

        if ($history == null) {
            return response()->json(['error' => 'No prompt provided']);
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($apiUrl.$GeminiApikey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemPrompt.$history]
                        ]
                    ]
                ]
            ]);
            if ($response->successful()) {
                $data = $response['candidates'][0]['content']['parts'][0]['text'];
                return response()->json(['title' => $data]);
            }

        } catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()]);
        }

    }
}
