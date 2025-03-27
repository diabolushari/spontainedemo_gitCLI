<?php

namespace App\Services\DataLoader\JsonStructure;

enum JsonFieldType: string
{
    case ARRAY = 'array';
    case OBJECT = 'object';
    case PRIMITIVE = 'primitive';
    case PRIMITIVE_ARRAY = 'primitive-array';

    /**
     * Get a human-readable description of the field type
     */
    public function description(): string
    {
        return match ($this) {
            self::ARRAY => 'An array of complex objects',
            self::OBJECT => 'A single complex object',
            self::PRIMITIVE => 'A single primitive value (string, number, boolean)',
            self::PRIMITIVE_ARRAY => 'An array of primitive values',
        };
    }

    /**
     * Check if the field type represents an array
     */
    public function isArray(): bool
    {
        return match ($this) {
            self::ARRAY, self::PRIMITIVE_ARRAY => true,
            self::OBJECT, self::PRIMITIVE => false,
        };
    }

    /**
     * Check if the field type represents a primitive value
     */
    public function isPrimitive(): bool
    {
        return match ($this) {
            self::PRIMITIVE, self::PRIMITIVE_ARRAY => true,
            self::ARRAY, self::OBJECT => false,
        };
    }
}
