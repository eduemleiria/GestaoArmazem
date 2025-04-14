<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Artigo extends Model
{
    protected $table = 'artigos';
    public $timestamps = false;

    protected $fillable = [
        'nome',
        'idCliente',
        'idUser',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'idCliente');
    }

    public function paletes()
    {
        return $this->hasMany(Palete::class, 'idArtigo');
    }
}
