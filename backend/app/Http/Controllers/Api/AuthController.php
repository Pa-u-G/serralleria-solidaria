<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credencials incorrectes'
            ], 401);
        }

        // Generar token manual
        $token = Str::random(60);
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }
        
        return response()->json(['message' => 'Sessió tancada correctament']);
    }

    // Usuari actual
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}