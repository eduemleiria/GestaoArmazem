<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Documento;
use App\Models\Palete;

class DashboardController extends Controller
{
    public function dashboard(){
        $numDocsEntHj = count(Documento::where('tipoDoc', 'Documento de Entrada')->whereDate('data', date("Y-m-d"))->get());
        $numDocsSaidaHj = count(Documento::where('tipoDoc', 'Documento de Saída')->whereDate('data', date("Y-m-d"))->get());
        $numPaletesTotal = Palete::where('dataSaida', null)->sum('quantidade');

        return Inertia::render('dashboard', [
            'numDocsEntHj' => $numDocsEntHj,
            'numDocsSaidaHj' => $numDocsSaidaHj,
            'paletesNoArmazem' => $numPaletesTotal
        ]);
    }
}
