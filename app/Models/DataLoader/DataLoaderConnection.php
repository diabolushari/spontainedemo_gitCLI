<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
