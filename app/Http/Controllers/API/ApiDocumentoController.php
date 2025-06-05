<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Documento;
use App\Models\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApiDocumentoController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);
        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
        if (Carbon::now() <= $clienteLogado->expire_date) {
            $clienteLogado->update([
                'last_used_at' => Carbon::now(),
            ]);

            $idCliente = Cliente::where('nome', $clienteLogado->name)->first();

            return Documento::where('idCliente', $idCliente->id)->get();
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipoDoc' => ['required', Rule::in(['Documento de Entrada', 'Documento de Saída'])],
            'data' => 'date_multi_format:"Y-m-d H:i:s","Y-m-d"',
            'token' => 'required'
        ]);

        if($request['tipoDoc'] == "Documento de Saída"){
            $request->validate([
                'moradaD' => 'required',
                'matricula' => 'required',
            ]);
            $moradaD = $request['moradaD'];
            $matricula = $request['matricula'];
        }else{
            $moradaD = null;
            $matricula = null;
        }

        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();

        if (Carbon::now() <= $clienteLogado->expire_date) {
            $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
            $idCliente = Cliente::where('nome', $clienteLogado->name)->first();

            PersonalAccessToken::where('token', $request['token'])->update([
                'last_used_at' => Carbon::now(),
            ]);

            Documento::create([
                'estado' => "Pendente",
                'tipoDoc' => $request['tipoDoc'],
                'data' => $request['data'],
                'moradaC' => $idCliente->morada,
                'moradaD' => $moradaD,
                'matricula' => $matricula,
                'dataEmissao' => date('Y-m-d'),
                'idCliente' => $idCliente->id,
                'idUser' => null
            ]);

            return Documento::orderBy('id', 'desc')->first();
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }
}
