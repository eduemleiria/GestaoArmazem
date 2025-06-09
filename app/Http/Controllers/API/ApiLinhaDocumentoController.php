<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Artigo;
use App\Models\Cliente;
use App\Models\Documento;
use App\Models\linhasDocumento;
use App\Models\Palete;
use App\Models\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiLinhaDocumentoController extends Controller
{
    public function index(Request $request)
    {
        $tokenCliente = PersonalAccessToken::where('token', $request['token'])->first();
        if (Carbon::now() <= $tokenCliente->expire_date) {
            $request->validate([
                'token' => 'required',
                'idDocumento' => 'required'
            ]);

            $tokenCliente->update([
                'last_used_at' => Carbon::now(),
            ]);

            $clienteLogado = Cliente::where('nome', $tokenCliente->name)->first();

            // Tentar retribuir returns melhores (se nao pertence ao cliente etc)
            $documentoExiste = Documento::where('id', $request['idDocumento'])
                ->where('idCliente', $clienteLogado->id)
                ->first();

            if ($documentoExiste) {
                $documentoComLinhas["documento"] = [
                    'id' => $request['idDocumento'],
                    'tipoDoc' => $documentoExiste->tipoDoc,
                    'data' => $documentoExiste->data,
                    'moradaC' => $documentoExiste->moradaC ?? null,
                    'moradaD' => $documentoExiste->moradaD ?? null,
                    'matricula' => $documentoExiste->matricula ?? null,
                    'dataEmissao' => $documentoExiste->dataEmissao,
                    'idCliente' => $documentoExiste->idCliente,
                    'idUser' => $documentoExiste->idUser ?? null,
                    'linhas' => []
                ];

                foreach (linhasDocumento::where('idDocumento', $request['idDocumento'])->get() as $request) {
                    $documentoComLinhas["documento"]['linhas'][] = [
                        'id' => $request->id,
                        'nomeArtigo' => $request->idArtigo,
                        'quantidade' => $request->quantidade
                    ];
                }

                return $documentoComLinhas;
            } else {
                return "O documento com o id " . $request['idDocumento'] . " não existe ou não lhe pertence!";
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function porEntrar(Request $request)
    {
        // mostrar as linhas cujo os documentos de entrada estão em pendente
        return "Teste 123";
    }

    public function store(Request $request)
    {
        $tokenCliente = PersonalAccessToken::where('token', $request['token'])->first();

        if (Carbon::now() <= $tokenCliente->expire_date) {
            $request->validate([
                'idDocumento' => 'required|integer',
                'nomeArtigo' => 'required',
                'quantidade' => 'required|integer',
                'token' => 'required'
            ]);

            $tokenCliente->update([
                'last_used_at' => Carbon::now(),
            ]);

            $clienteLogado = Cliente::where('nome', $tokenCliente->name)->first();

            $documento = Documento::where('id', $request['idDocumento'])->where('idCliente', $clienteLogado->id)->first();

            if ($documento && ($documento->estado != "Concluído")) {
                $artigo = Artigo::where('nome', $request['nomeArtigo'])->first();

                if ($documento->tipoDoc == "Documento de Entrada") {
                    linhasDocumento::create([
                        'idDocumento' => $request['idDocumento'],
                        'idArtigo' => $artigo->id,
                        'quantidade' => $request['quantidade'],
                    ]);

                    return [
                        'mensagem' => "Foi adicionada uma linha ao documento com o id $documento->id",
                        'linha' => linhasDocumento::where('idDocumento', $request['idDocumento'])->orderBy('id', 'desc')->first(),
                    ];
                } else if ($documento->tipoDoc == "Documento de Saída") {

                    $quantidadeTotalPaletes = Palete::where('idArtigo', $artigo->id)->sum('quantidade');

                    $quantidadeTotalLinhas = linhasDocumento::where('idDocumento', $documento->id)
                        ->where('idArtigo', $artigo->id)
                        ->sum('quantidade');

                    if ($quantidadeTotalPaletes > 0) {
                        if ((int)$quantidadeTotalLinhas + (int)$request['quantidade'] <= $quantidadeTotalPaletes) {
                            $localizacoesEmUso = linhasDocumento::where('idArtigo', $artigo->id)
                                ->where('idDocumento', $documento->id)
                                ->pluck('localizacao');

                            $paleteSair = Palete::where('idArtigo', $artigo->id)
                                ->where('dataSaida', "=", null)
                                ->whereNotIn('localizacao', $localizacoesEmUso)
                                ->orderBy('quantidade', 'asc')
                                ->orderBy('dataEntrada', 'asc')
                                ->get();

                            $quantidadeFinal = 0;
                            $quantidades = [(int)$request['quantidade']];

                            $linhas = [];

                            for ($i = 0; $quantidadeFinal < $request['quantidade']; $i++) {
                                $quantidadeIterada = (int)$quantidades[$i] - (int)$paleteSair[$i]->quantidade;
                                $quantidades[] = (int)$quantidadeIterada;
                                if ($quantidades[$i + 1] >= 0) {
                                    $linha = LinhasDocumento::create([
                                        'idDocumento' => $documento->id,
                                        'idArtigo' => $artigo->id,
                                        'quantidade' => $paleteSair[$i]->quantidade,
                                        'localizacao' => $paleteSair[$i]->localizacao
                                    ]);
                                    $linhas[$i] = $linha;

                                    $quantidadeFinal += $paleteSair[$i]->quantidade;
                                } else {
                                    $quantidadeCerta = $paleteSair[$i]->quantidade + $quantidades[$i + 1];

                                    $linha = LinhasDocumento::create([
                                        'idDocumento' => $documento->id,
                                        'idArtigo' => $artigo->id,
                                        'quantidade' => $quantidadeCerta,
                                        'localizacao' => $paleteSair[$i]->localizacao
                                    ]);
                                    $linhas[$i] = $linha;

                                    $quantidadeFinal += $quantidadeCerta;
                                }
                            }

                            return [
                                'mensagem' => "Foi adicionado com sucesso uma linha ao documento $documento->id",
                                'linha' => $linhas,
                            ];
                        } else {
                            return "Só existem $quantidadeTotalPaletes paletes do artigo $artigo->nome no armazém!";
                        }
                    } else {
                        return "O artigo $artigo->nome não tem paletes no armazém";
                    }
                }
            } else {
                return "O documento com o id " . $request['idDocumento'] . " não existe ou não lhe pertence ou já está concluído!";
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }

    public function destroy(Request $request, $gestao_linha_documento)
    {
        $tokenCliente = PersonalAccessToken::where('token', $request['token'])->first();
        if (isset($tokenCliente) && Carbon::now() <= $tokenCliente->expire_date) {
            $request->validate([
                'token' => 'required'
            ]);

            $tokenCliente->update([
                'last_used_at' => Carbon::now(),
            ]);

            $idCliente = Cliente::where('nome', $tokenCliente->name)->first();

            $linha = linhasDocumento::where('id', $gestao_linha_documento)->first();
            $documento = Documento::where('id', $linha->idDocumento)
                ->where('idCliente', $idCliente->id)
                ->first();

            if ($linha && isset($documento)) {
                if ($documento->estado != "Concluído") {
                    $linha->delete();
                    return "A linha com o id $linha->id foi eliminada!";
                }
            } else {
                return 'A linha não existe ou o documento encontra-se no estado "Concluído"!';
            }
        } else {
            return "O token expirou! Faça login denovo para poder receber um novo token!";
        }
    }
}
