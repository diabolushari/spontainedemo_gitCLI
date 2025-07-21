<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property array{key: string, value: string|null}[]|null body
 * @property array{key: string, value: string|null}[]|null headers
 */
class LoaderAPI extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'loader_a_p_i_s';

    protected $fillable = [
        'name',
        'description',
        'url',
        'method',
        'headers',
        'body',
        'response_structure',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'headers' => 'array',
        'body' => 'array',
        'response_structure' => 'array',
    ];

    //relationships

    //scopes
}
