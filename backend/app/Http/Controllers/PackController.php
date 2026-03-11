<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    public function index()
    {
        return Pack::all();
    }

    public function show($id)
    {
        return Pack::with('products')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $pack = Pack::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'status' => true, // activo por defecto
        ]);

        return $pack;
    }

    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        // Solo actualizamos los campos que vengan
        if ($request->has('name')) {
            $pack->name = $request->name;
        }

        if ($request->has('description')) {
            $pack->description = $request->description;
        }

        if ($request->has('price')) {
            $pack->price = $request->price;
        }

        if ($request->has('status')) {
            $pack->status = $request->status;
        }

        $pack->save();

        return $pack;
    }

    public function destroy($id)
    {
        Pack::destroy($id);
        return response()->json(['message'=>'deleted']);
    }
}