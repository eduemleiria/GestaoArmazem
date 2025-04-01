<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::select('id', 'nome', 'morada')->get();

        return Inertia::render('gestao-clientes/listar-clientes', [
            'clientes' => $clientes
        ]);
    }

    public function store(Request $request)
    {
        $cliente = Cliente::create([
            'nome' => $request['nome'],
            'morada' => $request['morada'],
            'idUser' => $request->user()->id,
        ]);
        return redirect()->route('cliente.index')->with('success', 'Cliente adicionado com sucesso!');
    }

    public function edit($id)
    {
        $cliente = Cliente::find($id);
        return Inertia::render('gestao-clientes/editar-cliente', [
            'cliente' => $cliente
        ]);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        $cliente->update([
            'nome' => $request->input('nome'),
            'morada' => $request->input('morada'),
            'idUser'=> $request->user()->id,
        ]);

        return redirect()->route('cliente.index')->with('success', 'Cliente alterado com sucesso!');
    }

    public function destroy($id)
    {
        $cliente = Cliente::find($id);
        if ($cliente) {
            $cliente->delete();
            return redirect()->route('cliente.index')->with('success', 'Cliente removido com sucesso!');
        }

        return redirect()->route('cliente.index')->with('error', 'Erro ao remover o cliente.');
    }
}
