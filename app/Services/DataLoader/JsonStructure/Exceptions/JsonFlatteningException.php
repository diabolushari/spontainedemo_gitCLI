<?php

namespace App\Services\DataLoader\JsonStructure\Exceptions;

use Exception;

final class JsonFlatteningException extends Exception
{
    public static function invalidDataType(int $index): self
    {
        return new self("Item at index {$index} is not an array");
    }

    public static function nonSequentialArray(string $path): self
    {
        return new self("Array at path '{$path}' is not sequential");
    }

    public static function pathNotFound(string $path): self
    {
        return new self("Path '{$path}' not found in data");
    }

    public static function invalidParentType(string $path): self
    {
        return new self("Cannot set value at path '{$path}' - parent is not an array");
    }
}
