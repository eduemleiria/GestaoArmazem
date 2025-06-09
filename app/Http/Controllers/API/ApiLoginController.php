<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiLoginController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $cliente = Cliente::where('nome', $request['username'])->pluck('password')->first();

        $passwordHash = Hash::check($request['password'], $cliente);

        if ($passwordHash) {
            $timestamp = Carbon::now()->timestamp;
            $toHash = $request['username'] . '-' . $request['password'] . '-' . $timestamp;
            $token = Hash::make($toHash);

            if (PersonalAccessToken::where('name', $request['username'])->first()) {
                PersonalAccessToken::where('name', $request['username'])->first()->delete();
            }

            PersonalAccessToken::create([
                'name' => $request['username'],
                'token' => $token,
                'last_used_at' => Carbon::now(),
                'expire_date' => Carbon::now()->addMinutes(30)
            ]);

            return $token;
        } else {
            return "Username ou password erradas!";
        }
    }
}
