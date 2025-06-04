<?php

namespace App\Models\ChatHistory;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatHistory extends Model
{
    protected  $fillable = [
        'user_id',
        'title',
        'messages'
    ];

    protected $casts = [
        'messages' => 'array',
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
