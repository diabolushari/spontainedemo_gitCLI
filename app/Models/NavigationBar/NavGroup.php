<?php

namespace App\Models\NavigationBar;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\NavGroup
 *
 * @property int $id
 * @property string $nav_type
 * @property string $group_label
 * @property string $group_url
 * @property string $group_icon
 * @property string $group_pos
 * @property-read Collection<int, NavItem> $navItems
 * @property-read int|null $nav_items_count
 */
class NavGroup extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nav_groups';

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
        'nav_type',
        'group_label',
        'group_url',
        'group_icon',
        'group_pos',
    ];

    /**
     * Get the navigation items that belong to this group.
     * Defines a one-to-many relationship.
     */
    public function navItems(): HasMany
    {
        return $this->hasMany(NavItem::class, 'nav_group_id');
    }
}
