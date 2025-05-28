<?php

namespace App\Http\Controllers;

use App\Models\LinhasFatura;
use App\Models\Palete;
use Illuminate\Http\Request;

class LinhaFaturaController extends Controller
{
    public function store($request, $fatura, $linhaFatura){
        LinhasFatura::create([
            'idFatura' => $fatura->id,
            'idPalete' => $linhaFatura['idPalete'],
            'dias' => $linhaFatura['dias'],
            'subtotal' => $linhaFatura['subtotal'],
            'idUser' => $request->user()->id
        ]);

        $idLinhaFatura = LinhasFatura::latest('id')->first();

        Palete::where('id', $linhaFatura['idPalete'])->update([
            'idLinhaFatura' => $idLinhaFatura->id,
        ]);
    }
}
