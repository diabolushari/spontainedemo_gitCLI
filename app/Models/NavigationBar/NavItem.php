<?php

namespace App\Models\NavigationBar;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\NavItem
 *
 * @property int $id
 * @property int $nav_group_id
 * @property string $item_label
 * @property string $item_url
 * @property string $item_icon
 * @property string $item_pos
 * @property-read NavGroup $navGroup
 */
class NavItem extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nav_items';

    /**
     * Indicates if the model should be timestamped.
     * Your migration does not include timestamps (created_at, updated_at).
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nav_group_id',
        'item_label',
        'item_url',
        'item_icon',
        'item_pos',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the navigation group that this item belongs to.
     * Defines an inverse one-to-many relationship.
     */
    public function navGroup(): BelongsTo
    {
        return $this->belongsTo(NavGroup::class, 'nav_group_id');
    }
}
