<?php

namespace App\Models\WidgetEditor;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Model;

class Widget extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'collection_id',
        'title',
        'subtitle',
        'type',
        'data',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => AsArrayObject::class,
        ];
    }

    /**
     * Get the collection that owns this widget.
     */
    public function collection()
    {
        return $this->belongsTo(WidgetCollection::class, 'collection_id');
    }
}
