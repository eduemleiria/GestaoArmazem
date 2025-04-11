<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Contracts\Role as ContractsRole;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            $user->roles = $user->roles->map(fn($role) => $role->name);
            $user->unsetRelation('roles');
            return $user;
        });

        return Inertia::render('gestaoUsers/gestaoUsers', [
            'users' => $users
        ]);
    }

    public function create()
    {
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('gestaoUsers/adicionar-user', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $validado = $request->validate([
            'nome' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)->max(32)],
            'role' => 'required|string',
        ]);

        $roleById = Role::find($request['role']);

        $user = User::create([
            'name' => $validado['nome'],
            'email' => $validado['email'],
            'password' => Hash::make($validado['password']),
        ]);

        $user->assignRole($roleById);

        return redirect()->route('gestao-users')->with('success', 'Utilizador adicionado com sucesso!');
    }

    public function edit($id)
    {
        $roles = Role::select('id', 'name')->get();
        $user = User::find($id);
        $idRole = $user->roles->pluck('id');
        $nomeRole = $user->getRoleNames();

        return Inertia::render('gestaoUsers/editar-user', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'idRole' => $idRole,
                'nomeRole' => $nomeRole
            ],
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        $user->update([
            'name' => $request->input('nome'),
            'email' => $request->input('email'),
        ]);
        
        $user->roles()->detach();
        $roleById = Role::find($request['idRole']);
        $user->assignRole($roleById);

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
