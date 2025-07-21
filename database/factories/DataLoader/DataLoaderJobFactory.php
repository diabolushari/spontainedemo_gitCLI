<?php

namespace Database\Factories\DataLoader;

use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataLoader\DataLoaderQuery;
use App\Models\DataLoader\LoaderAPI;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataLoader\DataLoaderJob>
 */
final class DataLoaderJobFactory extends Factory
{
    protected $model = DataLoaderJob::class;

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
            'source_type' => $this->faker->randomElement(['sql', 'api']),
            'data_detail_id' => DataDetail::factory(),
            'query_id' => null,
            'api_id' => null,
            'delete_existing_data' => $this->faker->boolean(),
            'cron_expression' => '0 0 * * *', // Daily at midnight
            'start_date' => now(),
            'end_date' => null,
            'predecessor_job_id' => null,
            'field_mapping' => [],
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }

    /**
     * Configure job with SQL query source
     */
    public function withQuery(): static
    {
        return $this->state(fn (array $attributes) => [
            'source_type' => 'sql',
            'query_id' => DataLoaderQuery::factory(),
            'api_id' => null,
        ]);
    }

    /**
     * Configure job with API source
     */
    public function withApi(): static
    {
        return $this->state(fn (array $attributes) => [
            'source_type' => 'api',
            'query_id' => null,
            'api_id' => LoaderAPI::factory(),
        ]);
    }

    /**
     * Configure job to delete existing data
     */
    public function deleteExisting(): static
    {
        return $this->state(fn (array $attributes) => [
            'delete_existing_data' => true,
        ]);
    }

    /**
     * Configure job to preserve existing data
     */
    public function preserveExisting(): static
    {
        return $this->state(fn (array $attributes) => [
            'delete_existing_data' => false,
        ]);
    }

    /**
     * Configure job with hourly schedule
     */
    public function hourly(): static
    {
        return $this->state(fn (array $attributes) => [
            'cron_expression' => '0 * * * *',
        ]);
    }

    /**
     * Configure job with weekly schedule
     */
    public function weekly(): static
    {
        return $this->state(fn (array $attributes) => [
            'cron_expression' => '0 0 * * 0',
        ]);
    }

    /**
     * Configure job with end date
     */
    public function withEndDate(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => now()->addMonths(6),
        ]);
    }

    /**
     * Configure job with predecessor
     */
    public function withPredecessor(): static
    {
        return $this->state(fn (array $attributes) => [
            'predecessor_job_id' => self::factory(),
        ]);
    }
}
