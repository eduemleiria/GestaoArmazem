<?php

namespace App\Http\Controllers;

use App\Models\Palete;
use App\Models\Cliente;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaleteController extends Controller
{
    public function index()
    {
        $paletes = Palete::with('artigo:id,nome,idCliente')->get()->map(function ($palete) {
            $cliente = Cliente::where('id', $palete->artigo?->idCliente)->pluck('nome');
            return [
                'id' => $palete->id,
                'quantidade' => $palete->quantidade,
                'localizacao' => $palete->localizacao,
                'dataEntrada' => $palete->dataEntrada,
                'nomeArtigo' => $palete->artigo?->nome ?? 'Sem Artigo',
                'clienteArtigo' => $cliente,
            ];
        });

        return Inertia::render('gestao-paletes/listar-paletes', [
            'paletes' => $paletes,
        ]);
    }

    public function destroy($id)
    {
        $paleteApagar = Palete::where('id', $id)->delete();
        return redirect()->route('paletes.index')->with('success', 'Palete removida com sucesso!');
    }
}
