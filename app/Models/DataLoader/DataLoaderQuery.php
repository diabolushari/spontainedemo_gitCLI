<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $query
 * @property int $connection_id
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\DataLoader\DataLoaderConnection $loaderConnection
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereConnectionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereQuery($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderQuery withoutTrashed()
 * @mixin \Eloquent
 */
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
