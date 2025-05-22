<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinhasFatura extends Model
{
    protected $table = 'linhas_fatura';
    public $timestamps = false;

    protected $fillable = [
        'subtotal',
        'dias',
        'idPalete',
        'idFatura',
        'idUser',
    ];

    public function palete(): BelongsTo
    {
        return $this->belongsTo(Palete::class, 'idPalete');
    }

    public function fatura(): BelongsTo
    {
        return $this->belongsTo(Fatura::class, 'idFatura');
    }
}
