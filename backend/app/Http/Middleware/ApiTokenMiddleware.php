<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class ApiTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'No autoritzat'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invàlid'], 401);
        }
        
        // Vincular l'usuari a la request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        
        return $next($request);
    }
}