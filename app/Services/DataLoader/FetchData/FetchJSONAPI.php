<?php

namespace App\Services\DataLoader\FetchData;

use App\Services\DataLoader\DataSource\DataLoaderSource;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class FetchJSONAPI implements DataFetcher
{
    /**
     * @throws GuzzleException
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array
    {
        if ($dataSource->apiInfo == null) {
            throw new Exception('No API info found');
        }

        $client = new Client;

        $params = [];
        if ($dataSource->apiInfo->body != null) {
            foreach ($dataSource->apiInfo->body as $item) {
                $params[$item['key']] = $item['value'];
            }
        }

        $response = $client->request(
            $dataSource->apiInfo->method,
            $dataSource->apiInfo->url,
            ['query' => $params]
        );

        return json_decode($response->getBody()->getContents(), true);
    }
}
