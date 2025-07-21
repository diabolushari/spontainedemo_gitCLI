<?php

namespace Database\Factories\DataLoader;

use App\Models\DataLoader\LoaderAPI;
use App\Services\DataLoader\JsonStructure\JsonDefinition;
use App\Services\DataLoader\JsonStructure\JsonStructureDefinition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataLoader\LoaderAPI>
 */
final class LoaderAPIFactory extends Factory
{
    protected $model = LoaderAPI::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $defaultResponseStructure = new JsonStructureDefinition(
            lastUuid: 1,
            definition: new JsonDefinition(
                id: 1,
                fieldName: 'root',
                fieldType: 'object',
                primaryField: false,
                children: []
            )
        );

        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(),
            'url' => $this->faker->url(),
            'method' => $this->faker->randomElement(['GET', 'POST']),
            'headers' => [
                ['key' => 'Authorization', 'value' => 'Bearer ' . $this->faker->uuid()],
                ['key' => 'Content-Type', 'value' => 'application/json']
            ],
            'body' => [],
            'response_structure' => $defaultResponseStructure->toArray(),
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }

    /**
     * Configure the factory to create a GET API
     */
    public function get(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'GET',
            'body' => [],
        ]);
    }

    /**
     * Configure the factory to create a POST API
     */
    public function post(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'POST',
            'body' => [
                ['key' => 'param1', 'value' => 'value1'],
                ['key' => 'param2', 'value' => 'value2'],
            ],
        ]);
    }

    /**
     * Configure the factory with a weather API example
     */
    public function weatherApi(): static
    {
        $weatherResponseStructure = new JsonStructureDefinition(
            lastUuid: 4,
            definition: new JsonDefinition(
                id: 1,
                fieldName: 'root',
                fieldType: 'object',
                primaryField: false,
                children: [
                    new JsonDefinition(
                        id: 2,
                        fieldName: 'temperature',
                        fieldType: 'primitive',
                        primaryField: true,
                        children: []
                    ),
                    new JsonDefinition(
                        id: 3,
                        fieldName: 'location',
                        fieldType: 'object',
                        primaryField: false,
                        children: [
                            new JsonDefinition(
                                id: 4,
                                fieldName: 'city',
                                fieldType: 'primitive',
                                primaryField: false,
                                children: []
                            )
                        ]
                    )
                ]
            )
        );

        return $this->state(fn (array $attributes) => [
            'name' => 'Weather Data API',
            'description' => 'External weather service for regional climate data',
            'url' => 'https://api.weather.com/v1/current',
            'method' => 'GET',
            'headers' => [
                ['key' => 'Authorization', 'value' => 'Bearer WEATHER_API_KEY'],
                ['key' => 'Content-Type', 'value' => 'application/json']
            ],
            'body' => [],
            'response_structure' => $weatherResponseStructure->toArray(),
        ]);
    }

    /**
     * Configure the factory with a complex nested structure
     */
    public function complexStructure(): static
    {
        $complexResponseStructure = new JsonStructureDefinition(
            lastUuid: 8,
            definition: new JsonDefinition(
                id: 1,
                fieldName: 'root',
                fieldType: 'array',
                primaryField: false,
                children: [
                    new JsonDefinition(
                        id: 2,
                        fieldName: 'id',
                        fieldType: 'primitive',
                        primaryField: true,
                        children: []
                    ),
                    new JsonDefinition(
                        id: 3,
                        fieldName: 'attributes',
                        fieldType: 'object',
                        primaryField: false,
                        children: [
                            new JsonDefinition(
                                id: 4,
                                fieldName: 'name',
                                fieldType: 'primitive',
                                primaryField: false,
                                children: []
                            ),
                            new JsonDefinition(
                                id: 5,
                                fieldName: 'tags',
                                fieldType: 'primitive-array',
                                primaryField: false,
                                children: []
                            )
                        ]
                    ),
                    new JsonDefinition(
                        id: 6,
                        fieldName: 'relationships',
                        fieldType: 'object',
                        primaryField: false,
                        children: [
                            new JsonDefinition(
                                id: 7,
                                fieldName: 'related_items',
                                fieldType: 'array',
                                primaryField: false,
                                children: [
                                    new JsonDefinition(
                                        id: 8,
                                        fieldName: 'item_id',
                                        fieldType: 'primitive',
                                        primaryField: false,
                                        children: []
                                    )
                                ]
                            )
                        ]
                    )
                ]
            )
        );

        return $this->state(fn (array $attributes) => [
            'name' => 'Complex Data API',
            'description' => 'API with complex nested structure',
            'url' => 'https://api.complex.com/v1/data',
            'method' => 'GET',
            'response_structure' => $complexResponseStructure->toArray(),
        ]);
    }

    /**
     * Configure the factory with authentication headers
     */
    public function withAuth(string $authType = 'Bearer'): static
    {
        return $this->state(fn (array $attributes) => [
            'headers' => [
                ['key' => 'Authorization', 'value' => $authType . ' ' . $this->faker->uuid()],
                ['key' => 'Content-Type', 'value' => 'application/json'],
                ['key' => 'User-Agent', 'value' => 'KSEB-Analytics/1.0'],
            ],
        ]);
    }

    /**
     * Configure the factory without headers
     */
    public function withoutHeaders(): static
    {
        return $this->state(fn (array $attributes) => [
            'headers' => [],
        ]);
    }
}
