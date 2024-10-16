<?php

namespace App\Models\ReferenceData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $parameter
 * @property int $domain_id
 * @property int $has_second_value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereDomainId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereHasSecondValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereParameter($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferenceDataParameter withoutTrashed()
 * @mixin \Eloquent
 */
class ReferenceDataParameter extends Model
{
    use HasFactory;
    use SoftDeletes;
}
