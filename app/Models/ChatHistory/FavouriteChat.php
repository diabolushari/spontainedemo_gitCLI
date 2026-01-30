<?php

namespace App\Models\ChatHistory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FavouriteChat extends Model
{
    protected $fillable = [
        'chat_id',
        'summary',
        'message_id',
    ];

    public function chatHistory(): BelongsTo
    {
        return $this->belongsTo(ChatHistory::class, 'chat_id');
    }
}
