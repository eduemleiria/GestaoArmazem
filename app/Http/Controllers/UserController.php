<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at')->get();
        return Inertia::render('gestaoUsers/gestaoUsers', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'nome' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)->max(32)],
        ]);

        $user = User::create([
            'name' => $validado['nome'],
            'email' => $validado['email'],
            'password' => Hash::make($validado['password']),
        ]);

        return redirect()->route('gestao-users')->with('success', 'Utilizador adicionado com sucesso!');
    }

    public function edit($id)
    {
        $user = User::find($id);
        return Inertia::render('gestaoUsers/editar-user', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        $user->update([
            'name' => $request->input('nome'),
            'email' => $request->input('email'),
        ]);

        return redirect()->route('gestao-users')->with('success', 'Utilizador alterado com sucesso!');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return redirect()->route('gestao-users')->with('success', 'Utilizador removido com sucesso!');
        }
    
        return redirect()->route('gestao-users')->with('error', 'Erro ao remover o utilizador.');
    }
}
