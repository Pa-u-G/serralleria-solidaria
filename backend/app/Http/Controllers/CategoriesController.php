<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validamos el nombre
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Creamos la categoría con estado activo por defecto
        $category = Category::create([
            'name' => $request->name,
            'status' => true,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        // Solo permitimos actualizar name y status
        if ($request->has('name')) {
            $category->name = $request->name;
        }
        if ($request->has('status')) {
            $category->status = $request->status;
        }

        $category->save();

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
