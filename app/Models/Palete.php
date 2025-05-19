<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Palete extends Model
{
    protected $table = 'paletes';
    public $timestamps = false;

    protected $fillable = [
        'quantidade',
        'localizacao',
        'dataEntrada',
        'dataSaida',
        'idArtigo',
        'idLinhasDE',
        'idUser',
        'idLinhaFatura',
    ];

    public function artigo(): BelongsTo
    {
        return $this->belongsTo(Artigo::class, 'idArtigo');
    }

    public function linhasDocumento(): BelongsTo
    {
        return $this->belongsTo(linhasDocumento::class, 'idLinhasDE');
    }

    public function linhasFatura(): BelongsTo {
        return $this->belongsTo(linhasFatura::class, 'idLinhaFatura');
    }
}
