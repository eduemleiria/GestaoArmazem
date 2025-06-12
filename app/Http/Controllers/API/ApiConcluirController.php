<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Documento;
use App\Models\linhasDocumento;
use App\Models\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApiConcluirController extends Controller
{
    public function verificarLinhas($idDocumento)
    {
        $linhas = linhasDocumento::where('idDocumento', $idDocumento)->get();

        if (count($linhas) == 0) {
            return "Não existem linhas no documento!";
        } else {
            $documento = Documento::where('id', $idDocumento)->first();

            foreach ($linhas as $linha) {
                if ($linha->localizacao == null || $linha->localizacao == "Por determinar") {
                    if ($documento->tipoDoc == "Documento de Entrada") {
                        $validacao = "Certo";
                        continue;
                    } else {
                        $validacao = "Erro, as linhas deste documento não são compativeis com o tipo do documento!";
                        break;
                    }
                } else {
                    if ($documento->tipoDoc == "Documento de Saída") {
                        $validacao = "Certo";
                        continue;
                    } else {
                        $validacao = "Erro, isto é um documento de saída, não de entrada!";
                        break;
                    }
                }
            }
            return $validacao;
        }
    }

    public function concluir(Request $request)
    {
        $request->validate(['token' => 'required']);

        $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();

        if (Carbon::now() <= $clienteLogado->expire_date) {
            $request->validate([
                'idDocumento' => 'required'
            ]);

            $clienteLogado = PersonalAccessToken::where('token', $request['token'])->first();
            $cliente = Cliente::where('nome', $clienteLogado->name)->first();

            PersonalAccessToken::where('token', $request['token'])->update([
                'last_used_at' => Carbon::now(),
            ]);

            $documento = Documento::where('id', $request['idDocumento'])
                ->where('idCliente', $cliente->id)
                ->first();

            if (isset($documento)) {
                $verificar = $this->verificarLinhas($documento->id);
                
                if($verificar == "Certo"){
                    $documento->update([
                        'estado' => 'Pendente'
                    ]);
                    return [
                        'mensagem' => "O documento com o id $documento->id foi concluído com sucesso!",
                        $documento
                    ];
                }else{
                    return $verificar;
                }
            } else {
                return "O documento com o id " . $request['idDocumento'] . " não existe ou não lhe pertence!";
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }
}
