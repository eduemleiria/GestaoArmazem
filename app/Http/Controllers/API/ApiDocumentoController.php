<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Documento;
use App\Models\linhasDocumento;
use App\Models\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApiDocumentoController extends Controller
{
    public function index(Request $request)
    {
        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
        if (Carbon::now() <= $clienteLogado->expire_date) {
            $request->validate([
                'token' => 'required'
            ]);

            $clienteLogado->update([
                'last_used_at' => Carbon::now(),
            ]);

            $idCliente = Cliente::where('nome', $clienteLogado->name)->first();

            return Documento::where('idCliente', $idCliente->id)->exists() == true
                ? Documento::where('idCliente', $idCliente->id)->get()
                : "O cliente $idCliente->nome não tem documentos!";
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function store(Request $request)
    {
        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();

        if (Carbon::now() <= $clienteLogado->expire_date) {
            $request->validate([
                'tipoDoc' => ['required', Rule::in(['Documento de Entrada', 'Documento de Saída'])],
                'data' => 'date_multi_format:"Y-m-d H:i:s","Y-m-d"',
                'token' => 'required'
            ]);

            if ($request['tipoDoc'] == "Documento de Saída") {
                $request->validate([
                    'moradaD' => 'required',
                    'matricula' => 'required',
                ]);
                $moradaD = $request['moradaD'];
                $matricula = $request['matricula'];
            } else {
                $moradaD = null;
                $matricula = null;
            }

            $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
            $idCliente = Cliente::where('nome', $clienteLogado->name)->first();

            PersonalAccessToken::where('token', $request['token'])->update([
                'last_used_at' => Carbon::now(),
            ]);

            $documento = Documento::create([
                'estado' => "Rascunho",
                'tipoDoc' => $request['tipoDoc'],
                'data' => $request['data'],
                'moradaC' => $idCliente->morada,
                'moradaD' => $moradaD,
                'matricula' => $matricula,
                'dataEmissao' => date('Y-m-d'),
                'idCliente' => $idCliente->id,
                'idUser' => null
            ]);

            return Documento::orderBy('id', 'desc')->where('id', $documento->id)->first();
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function update(Request $request, $gestao_documento)
    {
        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
        if (Carbon::now() <= isset($clienteLogado->expire_date)) {
            $request->validate([
                'tipoDoc' => ['required', Rule::in(['Documento de Entrada', 'Documento de Saída'])],
                'data' => 'date_multi_format:"Y-m-d H:i:s","Y-m-d"',
                'token' => 'required'
            ]);

            if ($request['tipoDoc'] == "Documento de Saída") {
                $request->validate([
                    'moradaD' => 'required',
                    'matricula' => 'required',
                ]);
                $moradaD = $request['moradaD'];
                $matricula = $request['matricula'];
            } else {
                $moradaD = null;
                $matricula = null;
            }

            $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
            $cliente = Cliente::where('nome', $clienteLogado->name)->first();

            PersonalAccessToken::where('token', $request['token'])->update([
                'last_used_at' => Carbon::now(),
            ]);
            $documento = Documento::where('id', $gestao_documento)->where('idCliente', $cliente->id)->first();
            if (isset($documento)) {
                $documento->update([
                    'estado' => "Rascunho",
                    'tipoDoc' => $request['tipoDoc'],
                    'data' => $request['data'],
                    'moradaC' => $cliente->morada,
                    'moradaD' => $moradaD,
                    'matricula' => $matricula,
                    'dataEmissao' => date('Y-m-d'),
                    'idUser' => null
                ]);
                return [
                    'mensagem' => "O document com o id $documento->id foi editado com sucesso!",
                    $documento
                ];
            } else {
                return "O documento com o id $gestao_documento não lhe pertence ou não existe!";
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function destroy(Request $request, $gestao_documento)
    {
        $tokenCliente = PersonalAccessToken::where('token', $request['token'])->first();
        if ($tokenCliente && Carbon::now() <= $tokenCliente->expire_date) {
            $request->validate([
                'token' => 'required'
            ]);

            $tokenCliente->update([
                'last_used_at' => Carbon::now(),
            ]);

            $idCliente = Cliente::where('nome', $tokenCliente->name)->first();

            $documento = Documento::where('id', $gestao_documento)
                ->where('idCliente', $idCliente->id)
                ->first();

            if (isset($documento)) {
                if ($documento->estado != "Concluído") {
                    foreach (linhasDocumento::where('idDocumento', $documento->id)->get() as $linha) {
                        $linha->delete();
                    }

                    $documento->delete();

                    return "O documento com o id $gestao_documento foi eliminado!";
                }
            } else {
                return 'O documento não existe ou não lhe pertence ou encontra-se no estado "Concluído"!';
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }
}
