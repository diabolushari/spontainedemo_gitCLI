<?php

namespace Database\Factories\DataLoader;

use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataLoader\DataLoaderQuery>
 */
final class DataLoaderQueryFactory extends Factory
{
    protected $model = DataLoaderQuery::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'query' => 'SELECT * FROM test_table WHERE id = ?',
            'connection_id' => DataLoaderConnection::factory(),
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }

    /**
     * Configure with a simple SELECT query
     */
    public function simpleSelect(): static
    {
        return $this->state(fn (array $attributes) => [
            'query' => 'SELECT id, name, created_at FROM users',
        ]);
    }

    /**
     * Configure with a complex query
     */
    public function complexQuery(): static
    {
        return $this->state(fn (array $attributes) => [
            'query' => 'SELECT u.id, u.name, p.title FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.active = 1',
        ]);
    }

    /**
     * Configure with parameterized query
     */
    public function parameterized(): static
    {
        return $this->state(fn (array $attributes) => [
            'query' => 'SELECT * FROM data WHERE date >= ? AND status = ?',
        ]);
    }
}
