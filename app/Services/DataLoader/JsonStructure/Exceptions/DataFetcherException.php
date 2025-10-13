<?php

namespace App\Services\DataLoader\JsonStructure\Exceptions;

use Exception;

final class DataFetcherException extends Exception
{
    public static function invalidDataSourceType(): self
    {
        return new self('Invalid data source type for API');
    }

    public static function fieldNotPresent(string $fieldName): self
    {
        return new self($fieldName.' is not present in the data');
    }

    public static function nonSequentialArray(string $fieldName): self
    {
        return new self($fieldName.' : Array is not sequential');
    }

    public static function unexpectedArrayType(string $fieldName): self
    {
        return new self($fieldName.' is an array');
    }

    public static function fieldNotFound(string $fieldName): self
    {
        return new self('Unable to find '.$fieldName.' in the data.');
    }
}
