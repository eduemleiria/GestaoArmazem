<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Documento;
use App\Models\linhasDocumento;
use App\Models\Cliente;
use App\Models\Artigo;
use App\Models\Palete;
use Inertia\Inertia;
use DateTime;
use Illuminate\Support\Facades\Auth;

class DocumentoController extends Controller
{
    public function index()
    {
        $documentos = Documento::with('cliente:id,nome')->get()->map(function ($documento) {
            return [
                'id' => $documento->id,
                'estado' => $documento->estado,
                'tipoDoc' => $documento->tipoDoc,
                'data' => $documento->data,
                'nomeCliente' => $documento->cliente?->nome ?? 'Sem Cliente',
            ];
        });

        return Inertia::render('gestao-documentos/listar-documentos', [
            'documentos' => $documentos,
        ]);
    }

    public function create()
    {
        $clientes = Cliente::select('id', 'nome')->get();

        return Inertia::render('gestao-documentos/adicionar-doc', [
            'clientes' => $clientes
        ]);
    }

    public function buscaArtigosPaletes($idCliente)
    {
        $artigos = Artigo::where('idCliente', $idCliente)
            ->whereHas('paletes')
            ->with('paletes')
            ->get();

        return response()->json($artigos);
    }


    public function buscaArtigos($idCliente)
    {
        $artigos = Artigo::where('idCliente', $idCliente)->get();

        return response()->json($artigos);
    }

    public function store(Request $request)
    {
        $data = $request["dataP"];
        $hora = $request["horaP"];

        $datahoraJuntar = $data . ' ' . $hora;

        $datahora = new DateTime($datahoraJuntar);

        if ($request['tipoDoc'] == "Documento de Entrada" || $request['tipoDoc'] == "Documento de Saída") {
            $documento = Documento::create([
                'tipoDoc' => $request['tipoDoc'],
                'idCliente' => $request['idCliente'],
                'data' => $datahora->format('Y-m-d H:i:s'),
                'estado' => "Pendente",
                'idUser' => $request->user()->id,
            ]);

            foreach ($request->linhaDocumento as $linha) {
                LinhasDocumento::create([
                    'idDocumento' => $documento->id,
                    'idArtigo' => $linha['idArtigo'],
                    'localizacao' => $linha['localizacao'] ?? null,
                    'quantidade' => $linha['quantidade'],
                    'idUser' => $request->user()->id,
                ]);
            }
        }
        return redirect()->route('documento.index')->with('success', 'Documento adicionado com sucesso!');
    }

    public function show($id)
    {
        $documento = Documento::with('cliente:id,nome')->find($id);
        $documentoInfo = [
            'id' => $documento->id,
            'estado' => $documento->estado,
            'tipoDoc' => $documento->tipoDoc,
            'data' => $documento->data,
            'nomeCliente' => $documento->cliente?->nome ?? 'Sem Cliente',
        ];

        $linhasDocumento = linhasDocumento::where('idDocumento', $id)
            ->with('artigo:id,nome')
            ->get()
            ->map(function ($linhaDocumento) {
                return [
                    'id' => $linhaDocumento->id,
                    'idArtigo' => $linhaDocumento->artigo->nome,
                    'quantidade' => $linhaDocumento->quantidade,
                    'localizacao' => $linhaDocumento->localizacao ?? 'Por determinar',
                ];
            });

        return Inertia::render('gestao-documentos/detalhes-documento', [
            'documento' => $documentoInfo,
            'linhasDocumento' => $linhasDocumento
        ]);
    }

    public function edit($id)
    {
        $documento = Documento::with('cliente:id,nome')->find($id);

        $dataChegadaEm2 = explode(' ', $documento->data);

        $documentoInfo = [
            'id' => $documento->id,
            'estado' => $documento->estado,
            'tipoDoc' => $documento->tipoDoc,
            'data' => $dataChegadaEm2[0],
            'hora' => $dataChegadaEm2[1],
            'dataSaida' => $documento->dataSaida,
            'idCliente' => $documento->cliente?->id ?? 'Sem Cliente',
        ];

        $linhasDocumento = linhasDocumento::where('idDocumento', $id)
            ->with('artigo:id,nome')
            ->get()
            ->map(function ($linhaDocumento) {
                return [
                    'id' => $linhaDocumento->id,
                    'idArtigo' => $linhaDocumento->artigo->id,
                    'quantidade' => $linhaDocumento->quantidade,
                    'localizacao' => $linhaDocumento->localizacao ?? 'Por determinar',
                ];
            });

        $userLogadoRole = Auth::user()->roles->pluck("name")->first();
        $clientes = Cliente::select('id', 'nome')->get();

        return Inertia::render('gestao-documentos/editar-documento', [
            'userLogadoRole' => $userLogadoRole,
            'documento' => $documentoInfo,
            'linhasDocumento' => $linhasDocumento,
            'clientes' => $clientes
        ]);
    }

    public function update(Request $request, $id)
    {
        $userLogadoRole = Auth::user()->roles->pluck("name")->first();

        $documento = Documento::find($id);

        $data = $request["dataP"];
        $hora = $request["horaP"];

        $datahoraJuntar = $data . ' ' . $hora;

        $datahora = new DateTime($datahoraJuntar);
        if ($documento->estado == 'Concluído') {
            return redirect()->route('documento.index')->with('error', 'O documento encontra-se concluído!');
        } else {
            if ($userLogadoRole == "admin") {
                $documento->update([
                    'tipoDoc' => $request->input('tipoDoc'),
                    'idCliente' => $request->input('idCliente'),
                    'data' => $datahora->format('Y-m-d H:i:s'),
                    'idUser' => $request->user()->id,
                ]);

                foreach ($request->linhaDocumento as $linha) {
                    linhasDocumento::where('id', $linha['id'])->update([
                        'idArtigo' => $linha['idArtigo'],
                        'quantidade' => $linha['quantidade'],
                        'localizacao' => $linha['localizacao'],
                        'idUser' => $request->user()->id,
                    ]);
                }

                return redirect()->route('documento.index')->with('success', 'Documento alterado com sucesso!');
            } else if ($userLogadoRole == "gerente") {

                $documento = Documento::find($id);

                foreach ($request->linhaDocumento as $linha) {
                    if (!linhasDocumento::where('localizacao', '=', $linha['localizacao']) || $request['tipoDoc'] == "Documento de Saída") {
                        linhasDocumento::where('id', $linha['id'])->update([
                            'idArtigo' => $linha['idArtigo'],
                            'quantidade' => $linha['quantidade'],
                            'localizacao' => $linha['localizacao'],
                            'idUser' => $request->user()->id,
                        ]);

                        $encontraPalete = Palete::where('idArtigo', $linha['idArtigo'])->get();

                        if (!$encontraPalete) {
                            Palete::create([
                                'idArtigo' => $linha['idArtigo'],
                                'quantidade' => $linha['quantidade'],
                                'localizacao' => $linha['localizacao'],
                                'dataEntrada' => $datahora->format('Y-m-d H:i:s'),
                                'idLinhasDE' => $linha['id'],
                                'idUser' => $request->user()->id,
                            ]);
                            $documento->update([
                                'estado' => 'Concluído',
                            ]);
                        } else {
                            $quantidadeOriginal = Palete::where('idArtigo', $linha['idArtigo'])->pluck('quantidade')->sum();
                            $quantidadeASair = (int)$linha['quantidade'];
                            $stockRestante = $quantidadeOriginal - $quantidadeASair;
                            if ($stockRestante < 0) {
                                return redirect()->route('documento.index')->with('error', 'Não existem paletes suficientes! (Número de paletes existentes: '.$quantidadeOriginal.')');
                            } else {
                                Palete::where('idArtigo', $linha['idArtigo'])->update([
                                    'idArtigo' => $linha['idArtigo'],
                                    'quantidade' => $stockRestante,
                                    'localizacao' => $linha['localizacao'],
                                    'dataEntrada' => $datahora->format('Y-m-d H:i:s'),
                                    'idLinhasDE' => $linha['id'],
                                    'idUser' => $request->user()->id,
                                ]);
                                $documento->update([
                                    'estado' => 'Concluído',
                                ]);
                            }
                        }
                    } else {
                        return redirect()->route('documento.index')->with('error', 'A localização da palete já está ocupada!');
                    }
                }

                return redirect()->route('documento.index')->with('success', 'Documento alterado com sucesso!');
            }
        }
    }

    public function destroy($id)
    {
        $documento = Documento::find($id);
        if ($documento) {
            linhasDocumento::where("idDocumento", $id)->delete();
            $documento->delete();
            return redirect()->route('documento.index')->with('success', 'Documento removido com sucesso!');
        }

        return redirect()->route('documento.index')->with('error', 'Erro ao remover o documento.');
    }
}
