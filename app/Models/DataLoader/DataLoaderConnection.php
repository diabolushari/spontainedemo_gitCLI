<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataLoaderConnection extends Model
{
    use SoftDeletes;

    protected $table = 'loader_connections';

    protected $fillable = [
        'name',
        'description',
    ];
}
