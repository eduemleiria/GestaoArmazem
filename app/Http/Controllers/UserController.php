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
        $validated = $request->validate([
            'nome' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)->max(32)],
        ]);

        $user = User::create([
            'name' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('gestao-users')->with('sucesso');
    }
}
