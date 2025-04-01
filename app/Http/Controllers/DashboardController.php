<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cliente;

class DashboardController extends Controller
{
    public function dashboard(){
        $clientes = count(Cliente::all());
        return Inertia::render('dashboard', [
            'clientes' => $clientes
        ]);
    }
}
