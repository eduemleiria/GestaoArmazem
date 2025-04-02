<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    protected $table = 'documentos';
    public $timestamps = false;

    protected $fillable = [
        'estado',
        'tipoDoc',
        'dataChegada',
        'dataSaida',
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
