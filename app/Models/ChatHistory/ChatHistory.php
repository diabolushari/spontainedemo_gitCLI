<?php

namespace App\Models\ChatHistory;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatHistory extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'messages',
        'is_favorite'
    ];

    protected $casts = [
        'messages' => 'array',
        'is_favorite' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
