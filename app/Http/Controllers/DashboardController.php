<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Documento;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard(){
        $numDocsEntHj = count(Documento::where('tipoDoc', 'Documento de Entrada')->whereDate('data', date("Y-m-d"))->get());
        $numDocsSaidaHj = count(Documento::where('tipoDoc', 'Documento de Saída')->whereDate('data', date("Y-m-d"))->get());

        return Inertia::render('dashboard', [
            'numDocsEntHj' => $numDocsEntHj,
            'numDocsSaidaHj' => $numDocsSaidaHj
        ]);
    }
}
