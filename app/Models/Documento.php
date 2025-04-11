<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Documento extends Model
{
    protected $table = 'documentos';
    public $timestamps = false;

    protected $fillable = [
        'estado',
        'tipoDoc',
        'data',
        'moradaC',
        'moradaD',
        'matricula',
        'idCliente',
        'idUser',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'idCliente');
    }
}
