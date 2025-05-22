<?php

namespace App\Http\Controllers;

use App\Models\Fatura;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaturaController extends Controller
{
    public function index()
    {
        $faturas = Fatura::with('cliente:id,nome')->get()->map(function ($fatura) {
            return [
                'id' => $fatura->id,
                'nomeCliente' => $fatura->cliente?->nome ?? 'Sem Cliente',
                'dataEmissao' => $fatura->dataEmissao,
                'dataInicio' => $fatura->dataInicio,
                'dataFim' => $fatura->dataFim,
                'Total' => $fatura->total
            ];
        });

        return Inertia::render('gestao-faturas/listar-faturas', [
            'faturas' => $faturas,
        ]);
    }
}
