<?php

namespace App\Models\ReferenceData;

use App\Http\Requests\ReferenceDataRequests\ReferenceDataSearchRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\JoinClause;

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
