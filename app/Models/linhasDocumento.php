<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class linhasDocumento extends Model
{
    protected $table = 'linhas_documento';
    public $timestamps = false;

    protected $fillable = [
        'quantidade',
        'localizacao',
        'idArtigo',
        'idDocumento',
        'idUser',
    ];

    public function artigo(): BelongsTo
    {
        return $this->belongsTo(Artigo::class, 'idArtigo');
    }

    public function documento(): BelongsTo
    {
        return $this->belongsTo(Documento::class, 'idDocumento');
    }
}
