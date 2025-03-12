<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property array{key: string, value: string|null}[]|null body
 * @property array{key: string, value: string|null}[]|null headers
 */
class LoaderAPI extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'url',
        'method',
        'headers',
        'body',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'headers' => 'array',
        'body' => 'array',
    ];

    //relationships

    //scopes
}
