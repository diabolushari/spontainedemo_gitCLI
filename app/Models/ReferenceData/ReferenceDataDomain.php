<?php

namespace App\Models\ReferenceData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $domain
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain whereDomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataDomain withoutTrashed()
 * @mixin \Eloquent
 */
class ReferenceDataDomain extends Model
{
    use HasFactory;
    use SoftDeletes;
}
