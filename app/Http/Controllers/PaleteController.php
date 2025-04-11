<?php

namespace App\Http\Controllers;

use App\Models\Palete;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaleteController extends Controller
{
    public function index()
    {
        $paletes = Palete::with('artigo:id,nome')->get()->map(function ($palete) {
            return [
                'id' => $palete->id,
                'quantidade' => $palete->quantidade,
                'localizacao' => $palete->localizacao,
                'dataEntrada' => $palete->dataEntrada,
                'nomeArtigo' => $palete->artigo?->nome ?? 'Sem Artigo',
            ];
        });

        return Inertia::render('gestao-paletes/listar-paletes', [
            'paletes' => $paletes,
        ]);
    }
}
