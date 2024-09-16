<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataLoaderQuery extends Model
{
    use SoftDeletes;

    protected $table = 'loader_queries';

    protected $fillable = [
        'name',
        'description',
        'query',
        'connection_id',
    ];

    /**
     * @return BelongsTo<DataLoaderConnection, DataLoaderQuery>
     */
    public function loaderConnection(): BelongsTo
    {
        return $this->belongsTo(DataLoaderConnection::class, 'connection_id');
    }
}
