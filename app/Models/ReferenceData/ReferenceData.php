<?php

namespace App\Models\ReferenceData;

use App\Http\Requests\ReferenceDataRequests\ReferenceDataSearchRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\JoinClause;

/**
 * 
 *
 * @property int $id
 * @property int $domain_id
 * @property int $parameter_id
 * @property int|null $sort_order
 * @property string $value_one
 * @property string|null $value_two
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static Builder|ReferenceData filter(\App\Http\Requests\ReferenceDataRequests\ReferenceDataSearchRequest $searchRequest)
 * @method static Builder|ReferenceData fullData()
 * @method static Builder|ReferenceData joinedData()
 * @method static Builder|ReferenceData newModelQuery()
 * @method static Builder|ReferenceData newQuery()
 * @method static Builder|ReferenceData onlyTrashed()
 * @method static Builder|ReferenceData query()
 * @method static Builder|ReferenceData whereCreatedAt($value)
 * @method static Builder|ReferenceData whereCreatedBy($value)
 * @method static Builder|ReferenceData whereDeletedAt($value)
 * @method static Builder|ReferenceData whereDomainId($value)
 * @method static Builder|ReferenceData whereId($value)
 * @method static Builder|ReferenceData whereParameterId($value)
 * @method static Builder|ReferenceData whereSortOrder($value)
 * @method static Builder|ReferenceData whereUpdatedAt($value)
 * @method static Builder|ReferenceData whereUpdatedBy($value)
 * @method static Builder|ReferenceData whereValueOne($value)
 * @method static Builder|ReferenceData whereValueTwo($value)
 * @method static Builder|ReferenceData withTrashed()
 * @method static Builder|ReferenceData withoutTrashed()
 * @mixin \Eloquent
 */
class ReferenceData extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'domain_id',
        'parameter_id',
        'sort_order',
        'value_one',
        'value_two',
        'created_by',
        'updated_by',
    ];

    /**
     * @param  Builder<ReferenceData>  $builder
     * @return Builder<ReferenceData>
     */
    public function scopeJoinedData(Builder $builder): Builder
    {
        return $builder->leftJoin(
            'reference_data_domains as domain',
            fn (JoinClause $join) => $join->on('domain.id', '=', 'reference_data.domain_id')
        )->leftJoin(
            'reference_data_parameters as parameter',
            fn (JoinClause $join) => $join->on('parameter.id', '=', 'reference_data.parameter_id')
        );
    }

    /**
     * @param  Builder<ReferenceData>  $builder
     * @return Builder<ReferenceData>
     */
    public function scopeFullData(Builder $builder): Builder
    {
        return $this->joinedData()
            ->selectRaw('reference_data.*, parameter.parameter as parameter, domain.domain as domain');
    }

    /**
     * @param  Builder<ReferenceData>  $builder
     * @return Builder<ReferenceData>
     */
    public function scopeFilter(Builder $builder, ReferenceDataSearchRequest $searchRequest): Builder
    {
        return $builder->when(
            $searchRequest->domainId != null,
            fn (Builder $builder) => $builder->where('reference_data.domain_id', $searchRequest->domainId)
        )
            ->when(
                $searchRequest->parameterId != null,
                fn (Builder $builder) => $builder->where('reference_data.parameter_id', $searchRequest->parameterId)
            )
            ->when(
                $searchRequest->value != null,
                fn (Builder $builder) => $builder->where('reference_data.value_one', 'like', "%$searchRequest->value%")
            );
    }
}
