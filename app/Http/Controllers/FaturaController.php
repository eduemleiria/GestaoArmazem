<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artigo;
use App\Models\Cliente;
use App\Models\Fatura;
use App\Models\Palete;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use DateTime;

class FaturaController extends Controller
{
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
            ->where('idLinhaFatura', 0)
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
            $dataEntradaPalete = Carbon::parse($palete->dataEntrada);
            $dataSaidaPalete = $palete->dataSaida != null ? Carbon::parse($palete->dataSaida) : (clone $dataFimDocumeto);

            $dataInicioFacturacao = $this->maxDate($dataEntradaPalete, $dataInicioDocumento);
            $dataFimFacturacao = $this->minDate($dataSaidaPalete, $dataFimDocumeto);
            $dataFimFacturacao = $dataFimFacturacao->addDay(1);
            $dias = $dataInicioFacturacao->diffInDays($dataFimFacturacao);

            $subtotal = ((int)$dias * (int)$palete->quantidade) * 10;

            $paletes[] = [
                'idPalete' => $palete->id,
                'idArtigo' => $palete->artigo?->id,
                'nomeArtigo' => $palete->artigo?->nome,
                'quantidade' => $palete->quantidade,
                'diasFaturar' => $dias,
                'subtotal' => $subtotal
            ];
        }

        return response()->json(['paletes' => $paletes]);
    }

    public function index()
    {
        $faturas = Fatura::with('cliente:id,nome')->get()->map(function ($fatura) {
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
}
