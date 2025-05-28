<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\linhasDocumento;
use App\Models\Documento;
use App\Models\Palete;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LinhaDocumentoController extends Controller
{
    public function store($request, $documento, $linha)
    {
        $localizacoesEmUso = linhasDocumento::where('idArtigo', $linha['idArtigo'])
            ->where('idDocumento', $documento->id)
            ->pluck('localizacao');

        $paleteSair = Palete::where('idArtigo', $linha['idArtigo'])
            ->where('dataSaida', "=", null)
            ->whereNotIn('localizacao', $localizacoesEmUso)
            ->orderBy('quantidade', 'asc')
            ->orderBy('dataEntrada', 'asc')
            ->get();

        $quantidadeFinal = 0;
        $quantidades = [(int)$linha['quantidade']];

        for ($i = 0; $quantidadeFinal < $linha['quantidade']; $i++) {
            $quantidadeIterada = (int)$quantidades[$i] - (int)$paleteSair[$i]->quantidade;
            $quantidades[] = (int)$quantidadeIterada;
            if ($quantidades[$i + 1] >= 0) {
                LinhasDocumento::create([
                    'idDocumento' => $documento->id,
                    'idArtigo' => $linha['idArtigo'],
                    'quantidade' => $paleteSair[$i]->quantidade,
                    'localizacao' => $paleteSair[$i]->localizacao,
                    'idUser' => $request->user()->id,
                ]);
                $quantidadeFinal += $paleteSair[$i]->quantidade;
            } else {
                $quantidadeCerta = $paleteSair[$i]->quantidade + $quantidades[$i + 1];

                LinhasDocumento::create([
                    'idDocumento' => $documento->id,
                    'idArtigo' => $linha['idArtigo'],
                    'quantidade' => $quantidadeCerta,
                    'localizacao' => $paleteSair[$i]->localizacao,
                    'idUser' => $request->user()->id,
                ]);
                $quantidadeFinal += $quantidadeCerta;
            }
        }
    }

    public function update($request, $documento, $linha)
    {
        $userLogadoRole = Auth::user()->roles->pluck("name")->first();

        if ($userLogadoRole == "admin") {
            $linhasDocOrg = linhasDocumento::where('idArtigo', $linha['idArtigo'])->where('idDocumento', $documento->id)->first();
            if (!$linhasDocOrg) {
                $this->store($request, $documento, $linha);
            } else {
                $linhasDocDifPaleteQuant = linhasDocumento::join('paletes', function ($join) {
                    $join->on('paletes.localizacao', '=', 'linhas_documento.localizacao')
                        ->on('paletes.quantidade', '!=', 'linhas_documento.quantidade');
                })
                    ->where('linhas_documento.idArtigo', $linha['idArtigo'])
                    ->where('linhas_documento.idDocumento', $documento->id)
                    ->where('paletes.dataSaida', '=', null)
                    ->orderBy('paletes.quantidade', 'asc')
                    ->orderBy('paletes.dataEntrada', 'asc')
                    ->select(
                        'linhas_documento.quantidade AS ld_qnt',
                        'paletes.quantidade AS p_qnt',
                        'linhas_documento.id AS id',
                        'linhas_documento.localizacao AS localizacao'
                    )
                    ->get();

                $localizacoesEmUso = linhasDocumento::where('idArtigo', $linha['idArtigo'])
                    ->where('idDocumento', $documento->id)
                    ->pluck('localizacao');

                $linhasDocDiffPalete = DB::table('paletes')
                    ->where('idArtigo', $linha['idArtigo'])
                    ->whereNotIn('localizacao', $localizacoesEmUso)
                    ->where('dataSaida', '=', null)
                    ->orderBy('quantidade', 'asc')
                    ->orderBy('dataEntrada', 'asc')
                    ->first();

                if ($linhasDocDifPaleteQuant->isEmpty()) {
                    //A palete e a linha têm a mesma quantidade;
                    $restoDepoisPedido = $linhasDocDiffPalete->quantidade - $linha['quantidade'];

                    if ($restoDepoisPedido >= 0) {
                        linhasDocumento::create([
                            'idDocumento' => $documento->id,
                            'idArtigo' => $linha['idArtigo'],
                            'quantidade' => $linha['quantidade'],
                            'localizacao' => $linhasDocDiffPalete->localizacao,
                            'idUser' => $request->user()->id,
                        ]);
                    } else {
                        $this->store($request, $documento, $linha);
                    }
                } else {
                    //Há uma linha no documento com quantidade inferior há palete que está a usar;
                    $quantidades = [(int)$linha['quantidade']];

                    for ($i = 0; $i < count($linhasDocDifPaleteQuant); $i++) {
                        $paletesDisp = $linhasDocDifPaleteQuant[$i]->p_qnt - $linhasDocDifPaleteQuant[$i]->ld_qnt;
                        $restoPedido = $linha['quantidade'] - $paletesDisp;

                        $quantidades[] = $restoPedido;

                        /* 
                        Só se entra no if quando o $restoPedido é >= 0, pois significa que, a linha
                        cujo a quantidade é inferior há quantidade da palete que está a "usar", não
                        consegue retirar mais "quantidade" daquela localização.
                        */

                        if ($restoPedido >= 0) {
                            linhasDocumento::where('id', $linhasDocDifPaleteQuant[$i]->id)->update([
                                'idDocumento' => $documento->id,
                                'idArtigo' => $linha['idArtigo'],
                                'quantidade' => $linhasDocDifPaleteQuant[$i]->p_qnt,
                                'localizacao' => $linhasDocDifPaleteQuant[$i]->localizacao,
                                'idUser' => $request->user()->id,
                            ]);

                            for ($x = 0; array_key_last($quantidades) >= 0; $x++) {
                                $restoSemUsoPalete = $linhasDocDiffPalete->quantidade - $quantidades[$x + 1];
                                $quantidadeAdd = $linhasDocDiffPalete->quantidade - $restoSemUsoPalete;
                                $novoRestoPedido = $quantidades[$x + 1] - $quantidadeAdd;
                                $quantidades[] = $novoRestoPedido;

                                if ($quantidadeAdd > 0) {
                                    linhasDocumento::create([
                                        'idDocumento' => $documento->id,
                                        'idArtigo' => $linha['idArtigo'],
                                        'quantidade' => $quantidadeAdd,
                                        'localizacao' => $linhasDocDiffPalete->localizacao,
                                        'idUser' => $request->user()->id,
                                    ]);
                                }
                                break;
                            }
                        } else {
                            $quantidadeAddLinha = $paletesDisp + $restoPedido;
                            $quantidadeTotalLinha = $quantidadeAddLinha + $linhasDocDifPaleteQuant[$i]->ld_qnt;

                            linhasDocumento::where('id', $linhasDocDifPaleteQuant[$i]->id)->update([
                                'idDocumento' => $documento->id,
                                'idArtigo' => $linha['idArtigo'],
                                'quantidade' => $quantidadeTotalLinha,
                                'localizacao' => $linhasDocDifPaleteQuant[$i]->localizacao,
                                'idUser' => $request->user()->id,
                            ]);
                        }
                        break;
                    }
                }
            }
        } else if ($userLogadoRole == "gerente") {
            dd("Estás aqui!");
        }
    }
}
