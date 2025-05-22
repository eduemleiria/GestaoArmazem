<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fatura extends Model
{
    protected $table = 'faturas';
    public $timestamps = false;

    protected $fillable = [
        'total',
        'dataEmissao',
        'dataInicio',
        'dataFim',
        'idCliente',
        'idUser',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'idCliente');
    }
}
