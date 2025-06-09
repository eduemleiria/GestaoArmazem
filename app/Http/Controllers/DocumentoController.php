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
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentoController extends Controller
{
    public function buscaArtigos($idCliente)
    {
        $artigos = Artigo::where('idCliente', $idCliente)->get();

        return response()->json($artigos);
    }

    public function buscaArtigosPaletes($idCliente)
    {
        $artigos = Artigo::where('idCliente', $idCliente)
            ->whereHas('paletes')
            ->with('paletes')
            ->get();

        return response()->json($artigos);
    }

    public function procurarDocumentos($procurar)
    {
        $documentos = Documento::with('cliente:id,nome')
            ->where(function ($query) use ($procurar) {
                $query->where('id', $procurar)
                    ->orWhere('estado', $procurar)
                    ->orWhere('tipoDoc', $procurar)
                    ->orWhere('data', 'like', "%{$procurar}%")
                    ->orWhere('dataEmissao', 'like', "%{$procurar}%")
                    ->orWhereHas('cliente', function ($query) use ($procurar) {
                        $query->where('nome', 'like', "%{$procurar}%");
                    });
            })
            ->paginate(5)
            ->through(function ($documento) {
                return [
                    'id' => $documento->id,
                    'estado' => $documento->estado,
                    'tipoDoc' => $documento->tipoDoc,
                    'data' => $documento->data,
                    'dataEmissao' => $documento->dataEmissao,
                    'nomeCliente' => $documento->cliente?->nome ?? 'Sem Cliente',
                ];
            });

        return response()->json($documentos);
    }

    public function index()
    {
        $documentosPaginados = Documento::with('cliente:id,nome')->paginate(5);

        $documentosPaginados->getCollection()->transform(function ($documento) {
            return [
                'id' => $documento->id,
                'estado' => $documento->estado,
                'tipoDoc' => $documento->tipoDoc,
                'data' => $documento->data,
                'dataEmissao' => $documento->dataEmissao,
                'nomeCliente' => $documento->cliente?->nome ?? 'Sem Cliente',
            ];
        });

        return Inertia::render('gestao-documentos/listar-documentos', [
            'documentos' => $documentosPaginados,
        ]);
    }

    public function create()
    {
        $clientes = Cliente::select('id', 'nome', 'morada')->get();

        return Inertia::render('gestao-documentos/adicionar-doc', [
            'clientes' => $clientes
        ]);
    }

    public function store(Request $request)
    {
        $data = $request["dataP"];
        $hora = $request["horaP"];

        $datahoraJuntar = $data . ' ' . $hora;

        $datahora = new DateTime($datahoraJuntar);

        $documento = Documento::create([
            'tipoDoc' => $request['tipoDoc'],
            'idCliente' => $request['idCliente'],
            'data' => $datahora->format('Y-m-d H:i:s'),
            'estado' => "Pendente",
            'moradaC' => $request['moradaC'] ?? null,
            'moradaD' => $request['moradaD'] ?? null,
            'matricula' => $request['matricula'] ?? null,
            'dataEmissao' => date('Y-m-d'),
            'idUser' => $request->user()->id,
        ]);

        foreach ($request->linhaDocumento as $linha) {
            if ($request['tipoDoc'] == "Documento de Entrada") {
                LinhasDocumento::create([
                    'idDocumento' => $documento->id,
                    'idArtigo' => $linha['idArtigo'],
                    'quantidade' => $linha['quantidade'],
                    'localizacao' => $linha['localizacao'] ?? null,
                    'idUser' => $request->user()->id,
                ]);
            } else if ($request['tipoDoc'] == "Documento de Saída") {
                $artigoPaletes = Palete::where('idArtigo', '=', $linha['idArtigo'])
                    ->where('dataSaida', "=", null)
                    ->get();

                $totalPaletes = $artigoPaletes->sum('quantidade');

                if ($linha['quantidade'] > $totalPaletes) {
                    $ultimoDoc = Documento::orderBy('id', 'desc')->first();
                    LinhasDocumento::where('idDocumento', $ultimoDoc->id)->delete();
                    Documento::where('id', $ultimoDoc->id)->delete();

                    return redirect()->route('documento.index')->with('error', 'Não existem paletes suficientes!');
                }

                $linhaDocumentoController = app(LinhaDocumentoController::class);
                $linhaDocumentoController->store($request, $documento, $linha);
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
            'dataEmissao' => $documento->dataEmissao,
            'nomeCliente' => $documento->cliente?->nome ?? 'Sem Cliente',
            'moradaC' => $documento->moradaC,
            'moradaD' => $documento->moradaD,
            'matricula' => $documento->matricula
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
            'moradaC' => $documento->moradaC,
            'moradaD' => $documento->moradaD,
            'matricula' => $documento->matricula
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

        $contaLinhas = count($request->linhaDocumento);

        $data = $request["dataP"];
        $hora = $request["horaP"];

        $datahoraJuntar = $data . ' ' . $hora;

        $datahora = new DateTime($datahoraJuntar);

        if ($documento->estado == 'Concluído') {
            return redirect()->route('documento.index')->with('error', 'O documento encontra-se concluído!');
        } else {
            $documento->update([
                'moradaC' => $request->input('moradaC'),
                'moradaD' => $request->input('moradaD'),
                'matricula' => $request->input('matricula'),
                'data' => $datahora->format('Y-m-d H:i:s'),
                'dataEmissao' => date('Y-m-d'),
                'idUser' => $request->user()->id,
            ]);

            $linhasDoc = linhasDocumento::where('idDocumento', $documento->id)->get();
            $numLinhasOrg = $linhasDoc->count();
            $idLinhasOrg = array();
            $idLinhasReq = array();

            for ($i = 0; $i < $numLinhasOrg; $i++) {
                if (array_key_exists($linhasDoc[$i]->id, $idLinhasOrg)) {
                    $idLinhasOrg[$i] += (int)$linhasDoc[$i]->id;
                } else {
                    $idLinhasOrg[$i] = (int)$linhasDoc[$i]->id;
                }
            }

            foreach ($request->linhaDocumento as $linha) {
                $idLinhasReq[] = (int)$linha['id'];
            }

            $diff = array_diff($idLinhasOrg, $idLinhasReq);

            foreach ($diff as $key => $value) {
                linhasDocumento::where('id', $value)->delete();
            }

            if ($userLogadoRole == "admin") {
                if ($request->input('tipoDoc') == "Documento de Entrada") {
                    foreach ($request->linhaDocumento as $linha) {
                        linhasDocumento::where('id', $linha['id'])->update([
                            'idArtigo' => $linha['idArtigo'],
                            'quantidade' => $linha['quantidade'],
                            'localizacao' => $linha['localizacao'],
                            'idUser' => $request->user()->id,
                        ]);
                    }

                    return redirect()->route('documento.index')->with('success', 'Documento alterado com sucesso!');
                } else if ($request->input('tipoDoc') == "Documento de Saída") {
                    $qntPedidaTotal = array();

                    foreach ($request->linhaDocumento as $linha) {
                        $artigoPaletes = Palete::where('idArtigo', '=', $linha['idArtigo'])->get();
                        $totalPaletes = $artigoPaletes->sum('quantidade');

                        if ($totalPaletes < $linha['quantidade']) {
                            return redirect()->route('documento.index')->with('error', 'Não existem paletes suficientes!');
                        } else {
                            if (array_key_exists($linha['idArtigo'], $qntPedidaTotal)) {
                                $qntPedidaTotal[$linha['idArtigo']] += $linha['quantidade'];
                            } else {
                                $qntPedidaTotal[$linha['idArtigo']] = (int)$linha['quantidade'];
                            }
                        }
                    }

                    foreach ($request->linhaDocumento as $linha) {
                        $artigoPaletes = Palete::where('idArtigo', '=', $linha['idArtigo'])->get();
                        $totalPaletes = $artigoPaletes->sum('quantidade');

                        if ($qntPedidaTotal[$linha['idArtigo']] > $totalPaletes) {
                            return redirect()->route('documento.index')->with('error', 'Não existem paletes suficientes!');
                        } else {
                            if (linhasDocumento::where('id', $linha['id'])->exists()) {
                                linhasDocumento::where('id', $linha['id'])->update([
                                    'idArtigo' => $linha['idArtigo'],
                                    'quantidade' => $linha['quantidade'],
                                    'localizacao' => $linha['localizacao'],
                                    'idUser' => $request->user()->id,
                                ]);
                            } else {
                                $linhaDocumentoController = app(LinhaDocumentoController::class);
                                $linhaDocumentoController->update($request, $documento, $linha);
                            }
                        }
                    }
                    return redirect()->route('documento.index')->with('success', 'Documento alterado com sucesso!');
                }
            } else if ($userLogadoRole == "gerente") {
                $documento = Documento::find($id);

                if ($documento->tipoDoc == "Documento de Entrada") {
                    foreach ($request->linhaDocumento as $linha) {
                        for ($i = 0; $i <= $contaLinhas - 1; $i++) {
                            if ($contaLinhas <= 1) {
                                break;
                            }

                            if ($request->linhaDocumento[$i]['localizacao'] == $request->linhaDocumento[$i + 1]['localizacao']) {
                                return redirect()->route('documento.index')->with('error', 'A mesma localização não pode ser inserida mais que 1 vez!');
                            } else {
                                break;
                            }
                        }

                        if (!Palete::where('localizacao', '=', $linha['localizacao'])->first()) {
                            // Serve de forma a reutilizar as linhas quando o gerente está a dividir
                            // quantidades de paletes por localização
                            if (linhasDocumento::where('id', $linha['id'])->first()) {
                                linhasDocumento::where('id', $linha['id'])->update([
                                    'idArtigo' => $linha['idArtigo'],
                                    'quantidade' => $linha['quantidade'],
                                    'localizacao' => $linha['localizacao'],
                                    'idUser' => $request->user()->id,
                                ]);
                            } else {
                                linhasDocumento::create([
                                    'idDocumento' => $request['id'],
                                    'idArtigo' => $linha['idArtigo'],
                                    'quantidade' => $linha['quantidade'],
                                    'localizacao' => $linha['localizacao'],
                                    'idUser' => $request->user()->id,
                                ]);
                            }
                        } else {
                            return redirect()->route('documento.index')->with('error', 'A localização da palete já está ocupada!');
                        }
                    }

                    $PaleteController = app(PaleteController::class);
                    $PaleteController->store($request);

                    $documento->update([
                        'estado' => 'Concluído',
                    ]);
                } else if ($documento->tipoDoc == "Documento de Saída") {
                    $PaleteController = app(PaleteController::class);
                    $PaleteController->store($request);
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

    public function gerarPDF($id)
    {
        $documento = Documento::where('id', $id)->with('cliente:id,nome')->first();
        $linhasDocumento = linhasDocumento::where('idDocumento', $id)->with('artigo:id,nome')->get();

        $infoDoc = [
            'id' => $id,
            'tipoDoc' => $documento->tipoDoc,
            'data' => $documento->data,
            'dataEmissao' => $documento->dataEmissao,
            'nomeCliente' => $documento->cliente?->nome,
            'moradaC' => $documento->moradaC,
            'moradaD' => $documento->moradaD,
            'matricula' => $documento->matricula,
        ];

        $linhas = [];

        foreach ($linhasDocumento as $linha) {
            $linhas[] = [
                'nomeArtigo' => $linha->artigo?->nome,
                'quantidade' => $linha->quantidade
            ];
        }
        $pdf = Pdf::loadView('guia-transporte', ['infoDoc' => $infoDoc, 'linhas' => $linhas]);

        return $pdf->download('guia-transporte_n' . $id . '.pdf');
    }
}
