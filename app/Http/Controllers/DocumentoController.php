<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Documento;
use Inertia\Inertia;

class DocumentoController extends Controller
{
    public function index()
    {
        $documentos = Documento::with('cliente:id,nome');

        $artigos = Artigo::with('cliente:id,nome')->get()->map(function ($artigo) {
            return [
                'id' => $artigo->id,
                'nome' => $artigo->nome,
                'nomeCliente' => $artigo->cliente?->nome ?? 'Sem Cliente',
            ];
        });

        return Inertia::render('gestao-documentos/listar-documentos', [
            'documentos' => $documentos,
        ]);
    }
}
