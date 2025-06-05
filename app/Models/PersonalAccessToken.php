<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalAccessToken extends Model
{
    protected $table = 'personal_access_tokens';

    protected $fillable = [
        'name',
        'token',
        'last_used_at',
        'expire_date'
    ];
}
