<?php

namespace App\Services\DataLoader\FetchData;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class FetchJSONAPI implements FetchDataInterface
{
    private ?string $url;

    private ?string $method;

    /** @var array<string, mixed> */
    private array $body = [];

    /** @var array<string, string> */
    private array $headers = [];

    /**
     * @throws GuzzleException
     * @throws Exception
     */
    public function getData(): array
    {
        $client = new Client;

        if ($this->url == null) {
            throw new Exception('URL is not set');
        }
        if ($this->method == null) {
            throw new Exception('Method is not set');
        }

        $options = [
            'headers' => $this->headers,
        ];

        if ($this->method == 'POST') {
            $contentType = strtolower($this->headers['Content-Type'] ?? 'application/json');
            if ($contentType == 'application/json') {
                $options['json'] = $this->body;
            }
            if ($contentType == 'application/x-www-form-urlencoded') {
                $options['form_params'] = $this->body;
            }
            if ($contentType == 'multipart/form-data') {
                $options['multipart'] = $this->body;
            }
        }

        if ($this->method == 'GET') {
            $options['query'] = $this->body;
        }

        $response = $client->request(
            $this->method,
            $this->url,
            $options
        );

        return json_decode($response->getBody()->getContents(), true);
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function setMethod(string $method): self
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @param  array<string, mixed>  $body
     * @return $this
     */
    public function setBody(array $body): self
    {
        $this->body = $body;

        return $this;
    }

    /**
     * @param  array<string, string>  $headers
     * @return $this
     */
    public function setHeaders(array $headers): self
    {
        $this->headers = $headers;

        return $this;
    }
}
