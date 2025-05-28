<?php

namespace App\Http\Controllers;

use App\Models\Palete;
use App\Models\Cliente;
use App\Models\Artigo;
use App\Models\Documento;
use App\Models\linhasDocumento;
use Inertia\Inertia;
use Illuminate\Http\Request;
use DateTime;

class PaleteController extends Controller
{
    public function index()
    {
        $paletes = Palete::with('artigo:id,nome,idCliente')
        ->where('dataSaida', "=", null)
        ->get()
        ->map(function ($palete) {
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

    public function store(Request $request)
    {
        $documento = Documento::find($request->id);
        $data = $request["dataP"];
        $hora = $request["horaP"];

        $datahoraJuntar = $data . ' ' . $hora;

        $datahora = new DateTime($datahoraJuntar);

        if ($request->tipoDoc == "Documento de Entrada") {
            foreach ($request->linhaDocumento as $linha) {
                if ($linha['confirmado'] == "Confirmado") {
                    Palete::create([
                        'idArtigo' => $linha['idArtigo'],
                        'quantidade' => $linha['quantidade'],
                        'localizacao' => $linha['localizacao'],
                        'dataEntrada' => $datahora->format('Y-m-d H:i:s'),
                        'idLinhasDE' => $linha['id'],
                        'idUser' => $request->user()->id,
                        'faturado' => 0,
                    ]);
                } else {
                    continue;
                }
            }
        } else if ($request->tipoDoc == "Documento de Saída") {
            foreach ($request->linhaDocumento as $linha) {
                $verificaLocQuant = Palete::where("localizacao", $linha['localizacao'])
                    ->where('quantidade', '>=', $linha['quantidade'])
                    ->where('idArtigo', $linha['idArtigo'])
                    ->first();

                if ($verificaLocQuant) {
                    if ($linha['confirmado'] == "Confirmado") {
                        $quantidadeFinal = (int)$verificaLocQuant->quantidade - (int)$linha['quantidade'];

                        Palete::create([
                            'idArtigo' => $verificaLocQuant->idArtigo,
                            'quantidade' => $linha['quantidade'],
                            'localizacao' => $verificaLocQuant->localizacao,
                            'dataEntrada' => $verificaLocQuant->dataEntrada,
                            'dataSaida' => $datahora->format('Y-m-d H:i:s'),
                            'idLinhasDE' => $linha['id'],
                            'idUser' => $request->user()->id,
                        ]);

                        if ($quantidadeFinal == 0) {
                            Palete::where('id', $verificaLocQuant->id)->delete();
                        } else {
                            Palete::where('id', $verificaLocQuant->id)->update([
                                'quantidade' => $quantidadeFinal,
                                'idUser' => $request->user()->id,
                            ]);
                        }
                    } else {
                        continue;
                    }

                    $documento->update([
                        'estado' => 'Concluído',
                    ]);
                } else {
                    return redirect()->route('documento.index')->with('error', 'Não existe nenhuma palete deste artigo nessa localização!');
                }
            }
        }
    }

    public function destroy($id)
    {
        $paleteApagar = Palete::where('id', $id)->delete();
        return redirect()->route('paletes.index')->with('success', 'Palete removida com sucesso!');
    }
}
