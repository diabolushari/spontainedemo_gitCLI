<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
final class CreateLoaderQueryWithConnectionData extends Data
{
    public function __construct(
        // Query fields
        #[Required, Max(255)]
        public readonly string $name,
        #[Nullable, Max(1000)]
        public readonly ?string $description,
        #[Required, Max(10000)]
        public readonly string $query,

        // Connection selection
        #[Required]
        public readonly bool $useExistingConnection,
        public readonly ?int $connectionId,

        // New connection fields
        public readonly ?string $connectionName,
        #[Nullable, Max(1000)]
        public readonly ?string $connectionDescription,
        public readonly ?string $driver,
        public readonly ?string $host,
        public readonly ?int $port,
        public readonly ?string $username,
        public readonly ?string $password,
        public readonly ?string $database,
    ) {}

    public static function rules(): array
    {
        return [
            'connection_id' => ['required_if:use_existing_connection,true', 'nullable', 'integer', 'exists:loader_connections,id'],
            'connection_name' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
            'driver' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
            'host' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
            'port' => ['required_if:use_existing_connection,false', 'nullable', 'integer'],
            'username' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
            'password' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
            'database' => ['required_if:use_existing_connection,false', 'nullable', 'string', 'max:255'],
        ];
    }
}
