<?php

namespace App\Http\Controllers\InsightsGen;

use App\Models\Insights\Insights;
use WebSocket\Client;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InsightsGen extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $agentUrl = env(key: 'AGENT_URL').'?token='.env(key: 'CHAT_TOKEN');
        $filePath = storage_path('app/Insights.json');
        $requestTemp = [
            'type' => 'question',
            'question' => 'hi',
        ];
        $options = [
            'timeout' => 60,
            'headers' => [
                'Origin' => 'something',
            ],
            'context' => stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ]
            ])
        ];

        if (!file_exists($filePath)) {
            echo("File not found");
            return;
        }

        $fileContent = file_get_contents($filePath);
        if($fileContent === false){
            echo("File read failed");
            return;
        }

        $jsonDecoded = json_decode($fileContent, true);
        if(json_last_error() !== JSON_ERROR_NONE){
            echo("JSON decode failed");
        }

        $descriptionRes = "";
        $titleRes = "";

        try{
            $client = new Client($agentUrl, $options);;
            foreach($jsonDecoded as $data){
                foreach($data['des_prompt'] as $prompt){
                    echo(json_encode($prompt));
                    $requestTemp['question'] = $prompt;
                    $client->send(json_encode($requestTemp));
                    while(true){
                        $descriptionRes = $client->receive();
                        $jsonDecodedRes = json_decode($descriptionRes, true);
                        if(isset($jsonDecodedRes['output'])){
                            break;
                        }
                    }
                }

                foreach($data['title_prompt'] as $prompt){
                    $requestTemp['question'] = $prompt;
                    $client->send(json_encode($requestTemp));
                    while(true){
                        $titleRes = $client->receive();
                        $jsonDecodedRes = json_decode($titleRes, true);
                        if(isset($jsonDecodedRes['output'])){
                            break;
                        }
                    }
                }
                $jsonTitleRes = json_decode($titleRes, true);
                echo(json_encode($jsonTitleRes['output']));

                $noFences = preg_replace('/```json\\s*|```/i', '', $jsonTitleRes['output']);
                $temp = json_decode($noFences, true);
                $title = $temp['title'];
                $risk = $temp['risk'];

                Insights::updateOrCreate(
                    [
                        'insight_id' => $data['id']
                    ],
                    [
                    'title' => $title,
                    'risk' => $risk,
                    'description' => $descriptionRes,
                    ]);
            }
            $client->close();
        }
        catch(\Exception $e){
            echo("Err ".$e);
        }
    }
}
