<?php

namespace App\Models\WidgetEditor;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class WidgetCollection extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the widgets that belong to this collection.
     */
    public function widgets()
    {
        return $this->hasMany(Widget::class, 'collection_id');
    }

    /**
     * Get the widget count attribute.
     */
    protected function widgetCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->widgets()->count(),
        );
    }

    /**
     * Get the last updated attribute.
     */
    protected function lastUpdated(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->updated_at?->diffForHumans(),
        );
    }

    /**
     * Append accessors to model's array form.
     *
     * @var array
     */
    protected $appends = ['widget_count', 'last_updated'];
}
