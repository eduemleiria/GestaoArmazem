<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artigo;
use App\Models\Cliente;
use App\Models\Fatura;
use App\Models\LinhasFatura;
use App\Models\Palete;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use DateTime;

class FaturaController extends Controller
{
    public function procurarFaturas($procurar)
    {
        $faturas = Fatura::with('cliente:id,nome')
            ->where(function ($query) use ($procurar) {
                $query->where('id', $procurar)
                    ->orWhereHas('cliente', function ($query) use ($procurar) {
                        $query->where('nome', 'like', "%{$procurar}%");
                    })
                    ->orWhere('dataEmissao', 'like', "%{$procurar}%")
                    ->orWhere('dataInicio', 'like', "%{$procurar}%")
                    ->orWhere('dataFim', 'like', "%{$procurar}%")
                    ->orWhere('total', 'like', "%{$procurar}%");
            })
            ->paginate(5);

        $faturas->getCollection()->transform(function ($fatura) {
            return [
                'id' => $fatura->id,
                'nomeCliente' => $fatura->cliente?->nome,
                'dataEmissao' => $fatura->dataEmissao,
                'dataInicio' => $fatura->dataInicio,
                'dataFim' => $fatura->dataFim,
                'total' => $fatura->total,
            ];
        });

        return response()->json($faturas);
    }

    private function minDate($a, $b)
    {
        return $a->greaterThan($b) ? $b : $a;
    }

    private function maxDate($a, $b)
    {
        return $a->greaterThan($b) ? $a : $b;
    }

    public function buscarPaletesPorFaturar($idCliente, $dataI, $dataF)
    {
        $artigos = Artigo::where('idCliente', $idCliente)->pluck('id');

        $paletesPorFaturar = Palete::whereIn('idArtigo', $artigos)
            ->with('artigo:id,nome')
            ->where('dataEntrada', '<=', $dataF)
            ->where(function ($query) use ($dataI) {
                $query->whereNull('dataSaida')
                    ->orWhere('dataSaida', '>=', $dataI);
            })
            ->orderBy('dataEntrada', 'ASC')
            ->get();

        $paletes = [];

        $dataInicioDocumento = Carbon::parse($dataI);
        $dataFimDocumeto = Carbon::parse($dataF);

        foreach ($paletesPorFaturar as $palete) {
            $dataEntradaPalete = Carbon::parse($palete->dataEntrada)->startOfDay();
            $dataSaidaPalete = $palete->dataSaida != null ? Carbon::parse($palete->dataSaida)->startOfDay() : (clone $dataFimDocumeto);

            $dataInicioFacturacao = $this->maxDate($dataEntradaPalete, $dataInicioDocumento);
            $dataFimFacturacao = $this->minDate($dataSaidaPalete, $dataFimDocumeto);
            $dataFimFacturacao2 = Carbon::parse($dataFimFacturacao)->addDay(1);
            $dias = $dataInicioFacturacao->diffInDays($dataFimFacturacao2);

            $subtotal = ((int)$dias * (int)$palete->quantidade) * 10;

            $paletes[] = [
                'idPalete' => $palete->id,
                'idArtigo' => $palete->artigo?->id,
                'nomeArtigo' => $palete->artigo?->nome,
                'quantidade' => $palete->quantidade,
                'dias' => $dias,
                'subtotal' => $subtotal
            ];
        }

        return response()->json(['paletes' => $paletes]);
    }

    public function index()
    {
        $faturas = Fatura::with('cliente:id,nome')->paginate(5);
        $faturas->getCollection()->transform(function ($fatura) {
            $dataInicio = new DateTime($fatura->dataInicio);
            $dataFim = new DateTime($fatura->dataFim);

            return [
                'id' => $fatura->id,
                'nomeCliente' => $fatura->cliente?->nome ?? 'Sem Cliente',
                'dataEmissao' => $fatura->dataEmissao,
                'dataInicio' => $dataInicio->format('Y-m-d'),
                'dataFim' => $dataFim->format('Y-m-d'),
                'total' => $fatura->total
            ];
        });

        return Inertia::render('gestao-faturas/listar-faturas', [
            'faturas' => $faturas,
        ]);
    }

    public function create()
    {
        $clientes = Cliente::get();

        return Inertia::render('gestao-faturas/adicionar-fatura', [
            'clientes' => $clientes,
        ]);
    }

    public function store(Request $request)
    {
        Fatura::create([
            'idCliente' => $request->idCliente,
            'dataInicio' => $request->dataI,
            'dataFim' => $request->dataF,
            'dataEmissao' => date("Y-m-d H:m:s"),
            'total' => $request->total,
            'idUser' => $request->user()->id
        ]);

        $fatura = Fatura::first();

        foreach ($request->linhaFatura as $linhaFatura) {
            $linhaFaturaController = app(LinhaFaturaController::class);
            $linhaFaturaController->store($request, $fatura, $linhaFatura);
        }

        return redirect()->route('faturas.index')->with('success', 'Fatura adicionada com sucesso!');
    }

    public function show($id)
    {
        $faturaFeita = Fatura::with('cliente:id,nome')->where('id', $id)->get()->map(function ($fatura) {
            $dataInicio = new DateTime($fatura->dataInicio);
            $dataFim = new DateTime($fatura->dataFim);

            return [
                'id' => $fatura->id,
                'nomeCliente' => $fatura->cliente?->nome ?? 'Sem Cliente',
                'dataInicio' => $dataInicio->format('Y-m-d'),
                'dataFim' => $dataFim->format('Y-m-d'),
                'dataEmissao' => $fatura->dataEmissao,
                'total' => $fatura->total,
            ];
        });

        $linhasFatura = LinhasFatura::where('linhas_fatura.idFatura', $id)
            ->join('paletes', 'linhas_fatura.idPalete', '=', 'paletes.id')
            ->join('artigos', 'paletes.idArtigo', '=', 'artigos.id')
            ->select(
                'linhas_fatura.*',
                'paletes.*',
                'artigos.nome as nomeArtigo'
            )->get();

        return Inertia::render('gestao-faturas/DetalhesFatura', [
            'fatura' => $faturaFeita->first(),
            'linhasFatura' => $linhasFatura
        ]);
    }

    public function destroy($id)
    {
        $procurarFatura = Fatura::find($id);

        if ($procurarFatura) {
            LinhasFatura::where('idFatura', $id)->delete();
            Fatura::where('id', $id)->delete();
            return redirect()->route('faturas.index')->with('success', 'Fatura removida com sucesso!');
        } else {
            return redirect()->route('faturas.index')->with('error', 'Ocurreu um erro ao tentar remover a fatura!');
        }
    }
}
