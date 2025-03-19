<?php

namespace App\Services\DataLoader\FetchData;

use Exception;
use GuzzleHttp\Exception\GuzzleException;

interface FetchDataInterface
{
    /**
     * Fetch data from the API
     *
     * @return array<string, mixed>
     *
     * @throws GuzzleException
     * @throws Exception
     */
    public function getData(): array;

    /**
     * Set the URL for the API request
     */
    public function setUrl(string $url): self;

    /**
     * Set the HTTP method for the request
     */
    public function setMethod(string $method): self;

    /**
     * Set the request body
     *
     * @param  array<string, mixed>  $body
     */
    public function setBody(array $body): self;

    /**
     * Set the request headers
     *
     * @param  array<string, string>  $headers
     */
    public function setHeaders(array $headers): self;
}
