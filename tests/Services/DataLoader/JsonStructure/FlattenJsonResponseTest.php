<?php

use App\Services\DataLoader\JsonStructure\FlattenJsonResponse;

it('flattens nested response data', function (): void {
    $input = [
        'name' => 'John',
        'age' => 30,
        'address' => [
            'street' => '123 Main St',
            'city' => 'New York',
            'coordinates' => [
                'lat' => 40.7128,
                'lng' => -74.006,
            ],
        ],
    ];

    $expected = [
        [
            'response.name' => 'John',
            'response.age' => 30,
            'response.address.street' => '123 Main St',
            'response.address.city' => 'New York',
            'response.address.coordinates.lat' => 40.7128,
            'response.address.coordinates.lng' => -74.006,
        ],
    ];

    $service = new FlattenJsonResponse;

    expect($service->flatten($input, '.', 'response'))->toBe($expected);
});

it('wraps string array into response objects', function (): void {
    $input = [
        'New York',
        'Los Angeles, CA',
        'Chicago, IL',
    ];

    $expected = [
        ['response' => 'New York'],
        ['response' => 'Los Angeles, CA'],
        ['response' => 'Chicago, IL'],
    ];

    $service = new FlattenJsonResponse;

    expect($service->flatten($input, '.', 'response'))->toBe($expected);
});

it('flattens array of response objects', function (): void {
    $input = [
        [
            'name' => 'John Doe',
            'age' => 30,
            'address' => [
                'street' => '123 Main St',
                'city' => 'New York',
                'coordinates' => [
                    'lat' => 40.7128,
                    'lng' => -74.0060,
                ],
            ],
        ],
        [
            'name' => 'Jane Doe',
            'age' => 32,
            'address' => [
                'street' => '456 Elm St',
                'city' => 'Los Angeles',
                'coordinates' => [
                    'lat' => 34.0522,
                    'lng' => -118.2437,
                ],
            ],
        ],
    ];

    $expected = [
        [
            'response.name' => 'John Doe',
            'response.age' => 30,
            'response.address.street' => '123 Main St',
            'response.address.city' => 'New York',
            'response.address.coordinates.lat' => 40.7128,
            'response.address.coordinates.lng' => -74.006,
        ],
        [
            'response.name' => 'Jane Doe',
            'response.age' => 32,
            'response.address.street' => '456 Elm St',
            'response.address.city' => 'Los Angeles',
            'response.address.coordinates.lat' => 34.0522,
            'response.address.coordinates.lng' => -118.2437,
        ],
    ];

    $service = new FlattenJsonResponse;

    expect($service->flatten($input, '.', 'response'))->toBe($expected);
});

it('flattens array of response objects with nested arrays', function (): void {
    $input = [
        [
            'name' => 'John Doe',
            'age' => 30,
            'scores' => [85, 90, 78],
        ],
        [
            'name' => 'Jane Doe',
            'age' => 32,
            'scores' => [88, 92, 81],
        ],
    ];

    $expected = [
        [
            'response.scores' => 85,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.scores' => 90,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.scores' => 78,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.scores' => 88,
            'response.name' => 'Jane Doe',
            'response.age' => 32,
        ],
        [
            'response.scores' => 92,
            'response.name' => 'Jane Doe',
            'response.age' => 32,
        ],
        [
            'response.scores' => 81,
            'response.name' => 'Jane Doe',
            'response.age' => 32,
        ],
    ];

    $service = new FlattenJsonResponse;

    expect($service->flatten($input, '.', 'response'))->toBe($expected);
});

it('flattens response object with nested child arrays', function (): void {
    $input = [
        [
            'name' => 'John Doe',
            'age' => 30,
            'scores' => [85, 90, 78],
            'address' => [
                'street' => '123 Main St',
                'city' => 'Los Angeles',
                'points' => [1, 2, 3],
            ],
        ],
    ];

    $expected = [
        [
            'response.scores' => 85,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.scores' => 90,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.scores' => 78,
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.address.points' => 1,
            'response.address.street' => '123 Main St',
            'response.address.city' => 'Los Angeles',
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.address.points' => 2,
            'response.address.street' => '123 Main St',
            'response.address.city' => 'Los Angeles',
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
        [
            'response.address.points' => 3,
            'response.address.street' => '123 Main St',
            'response.address.city' => 'Los Angeles',
            'response.name' => 'John Doe',
            'response.age' => 30,
        ],
    ];

    $service = new FlattenJsonResponse;

    expect($service->flatten($input, '.', 'response'))->toBe($expected);
});
