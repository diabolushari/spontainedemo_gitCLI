<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $driver
 * @property string $host
 * @property int $port
 * @property string $username
 * @property string $password
 * @property string $database
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DataLoader\DataLoaderQuery> $queries
 * @property-read int|null $queries_count
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereDatabase($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereDriver($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereHost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection wherePort($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderConnection withoutTrashed()
 * @mixin \Eloquent
 */
class DataLoaderConnection extends Model
{
    use SoftDeletes;

    protected $table = 'loader_connections';

    protected $fillable = [
        'name',
        'description',
        'driver',
        'host',
        'port',
        'username',
        'password',
        'database',
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'password',
    ];

    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = encrypt($value);
    }

    public function getPasswordAttribute(string $value): string
    {
        return decrypt($value);
    }

    /**
     * @return HasMany<DataLoaderConnection>
     */
    public function queries(): HasMany
    {
        return $this->hasMany(DataLoaderQuery::class, 'connection_id', 'id');
    }
}
