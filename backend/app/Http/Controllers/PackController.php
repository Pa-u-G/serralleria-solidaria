<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;
use App\Models\Pack_img;
use Illuminate\Support\Facades\Storage;


class PackController extends Controller
{
    public function index()
    {
        return Pack::all();
    }

    public function show($id)
    {
        return Pack::with('products', 'images')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $pack = Pack::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'status' => true, // activo por defecto
        ]);

        if ($request->hasFile('images')) {
            $request->validate([
                'images.*' => 'image|mimes:jpg,jpeg,png,webp'
            ]);

            foreach ($request->file('images') as $image) {
                $filename = time().'_'.$image->getClientOriginalName();
                $path = $image->storeAs('pack', $filename, 'public');

                Pack_img::create([
                    'pack_id' => $pack->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }

        return response()->json($pack->load('images'), 201);
    }

    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);

        // if ($request->has('name')) {
        //     $pack->name = $request->name;
        // }

        // if ($request->has('description')) {
        //     $pack->description = $request->description;
        // }

        // if ($request->has('price')) {
        //     $pack->price = $request->price;
        // }

        if ($request->has('status')) {
            $pack->status = $request->status;
            $pack->save();
        } else {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
            ]);
            $pack->update($validated);
        }

        // Subir nuevas imágenes
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = time().'_'.$image->getClientOriginalName();
                $path = $image->storeAs('pack', $filename, 'public');

                Pack_img::create([
                    'pack_id' => $pack->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }

        return response()->json($pack->load('images'), 201);
    }

    public function destroy($id)
    {
        Pack::destroy($id);
        return response()->json(['message'=>'deleted']);
    }

    public function delete_image($image_id)
    {
        $image = Pack_img::findOrFail($image_id);

        // Borrar archivo del storage
        Storage::disk('public')->delete($image->path);

        $image->delete();

        return response()->json(['message' => 'Imagen eliminada']);
    }

    public function getAllPacks(Request $request)
    {
        $query = Pack::with(['images', 'products', 'products.images'])
            ->where('status', true);
        
        // Ordenar
        $sortBy = $request->get('sort_by', 'newest');
        switch($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
        
        $packs = $query->get();
        
        return response()->json([
            'packs' => $packs,
            'total' => $packs->count()
        ]);
    }

    public function getPack($id)
    {
        $pack = Pack::with(['images', 'products' => function($q) {
            $q->with(['images', 'category']); // Cargar también imágenes de los productos
        }])->where('status', true)->find($id);
        
        if (!$pack) {
            return response()->json(['message' => 'Pack no encontrado'], 404);
        }
        
        // Calcular ahorro (si quieres mostrar comparativa con precios individuales)
        $totalIndividualPrice = $pack->products->sum(function($product) use ($pack) {
            $amount = $product->pivot->amount;
            return $product->price * $amount;
        });
        
        $savings = $totalIndividualPrice - $pack->price;
        
        return response()->json([
            'pack' => $pack,
            'total_individual_price' => $totalIndividualPrice,
            'savings' => $savings > 0 ? $savings : 0
        ]);
    }

}