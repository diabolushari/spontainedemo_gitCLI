<?php

namespace Database\Factories\DataLoader;

use App\Models\DataLoader\DataLoaderConnection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataLoader\DataLoaderConnection>
 */
final class DataLoaderConnectionFactory extends Factory
{
    protected $model = DataLoaderConnection::class;

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
            'driver' => 'mysql',
            'host' => $this->faker->domainName(),
            'port' => 3306,
            'database' => $this->faker->word(),
            'username' => $this->faker->userName(),
            'password' => $this->faker->password(),
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }

    /**
     * Configure for PostgreSQL
     */
    public function postgresql(): static
    {
        return $this->state(fn (array $attributes) => [
            'driver' => 'pgsql',
            'port' => 5432,
        ]);
    }

    /**
     * Configure for SQL Server
     */
    public function sqlserver(): static
    {
        return $this->state(fn (array $attributes) => [
            'driver' => 'sqlsrv',
            'port' => 1433,
        ]);
    }

    /**
     * Configure for local development
     */
    public function local(): static
    {
        return $this->state(fn (array $attributes) => [
            'host' => 'localhost',
            'database' => 'test_db',
            'username' => 'root',
            'password' => 'password',
        ]);
    }
}
