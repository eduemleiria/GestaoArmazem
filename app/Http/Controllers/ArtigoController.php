<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artigo;
use App\Models\Cliente;
use Inertia\Inertia;


class ArtigoController extends Controller
{

    public function index()
    {
        $artigos = Artigo::with('cliente:id,nome')->get()->map(function ($artigo) {
            return [
                'id' => $artigo->id,
                'nome' => $artigo->nome,
                'nomeCliente' => $artigo->cliente?->nome ?? 'Sem Cliente',
            ];
        });

        return Inertia::render('gestao-artigos/listar-artigos', [
            'artigos' => $artigos,
        ]);
    }

    public function create()
    {
        $clientes = Cliente::select('id', 'nome')->get();

        return Inertia::render('gestao-artigos/adicionar-artigo', [
            'clientes' => $clientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:150',
            'idCliente' => 'required|exists:clientes,id',
        ]);

        if (Artigo::where('nome', $request["nome"])->where('idCliente', $request["idCliente"])->exists()) {
            return redirect()->route('index')->with('error', 'O artigo inserido já existe!');  
        } else {
            $artigo = Artigo::create([
                'nome' => $validated['nome'],
                'idCliente' => $validated['idCliente'],
                'idUser' => $request->user()->id,
            ]);

            return redirect()->route('artigo.index')->with('success', 'Artigo adicionado com sucesso!');
        }
    }

    public function destroy($id)
    {
        $artigo = Artigo::find($id);
        if ($artigo) {
            $artigo->delete();
            return redirect()->route('artigo.index')->with('success', 'Artigo removido com sucesso!');
        }

        return redirect()->route('artigo.index')->with('error', 'Erro ao remover o artigo.');
    }
}
