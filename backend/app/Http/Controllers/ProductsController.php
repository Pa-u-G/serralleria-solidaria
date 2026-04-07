<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Product_img;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->merge([
            'star' => filter_var($request->star, FILTER_VALIDATE_BOOLEAN)
        ]);
        $validatedProduct = $request->validate([
            'code' => 'required',
            'name' => 'required',
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'star' => 'required|boolean'
        ]);

        $product = Product::create($validatedProduct);
        if ($request->has('characteristics')) {
            $product->characteristics()->sync($request->characteristics);
        }
        if ($request->hasFile('images')) {
            $request->validate([
                'images.*' => 'image|mimes:jpg,jpeg,png,webp'
            ]);

            foreach ($request->file('images') as $image) {
                $filename = time().'_'.$image->getClientOriginalName();
                $path = $image->storeAs('products', $filename, 'public');

                Product_img::create([
                    'product_id' => $product->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['images','characteristics.type'])->findOrFail($id);

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required',
            'name' => 'required',
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'star' => 'required|boolean',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp'
        ]);

        $product->update($validated);
        if ($request->has('characteristics')) {
            $product->characteristics()->sync($request->characteristics);
        } else {
            $product->characteristics()->sync([]); // elimina todas si no vienen
        }

        // Subir nuevas imágenes
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = time().'_'.$image->getClientOriginalName();
                $path = $image->storeAs('products', $filename, 'public');

                Product_img::create([
                    'product_id' => $product->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }

        return response()->json($product->load('images'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function change_status(Request $request, string $id) 
    {
        $product = Product::findOrFail($id);

        if ($request->has('status')) {
            $product->status = $request->status;
        }

        $product->save();

        return response()->json($product);
    }

    public function delete_image($image_id)
    {
        $image = Product_img::findOrFail($image_id);

        // Borrar archivo del storage
        Storage::disk('public')->delete($image->path);

        $image->delete();

        return response()->json(['message' => 'Imagen eliminada']);
    }
    

        public function getProductsByCategory($categoryId)
    {
        $category = Category::with('products.images')->find($categoryId);
        
        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
        
        $products = $category->products()
            ->where('status', true)
            ->with('images')
            ->get();
        
        return response()->json([
            'category' => $category,
            'products' => $products
        ]);
    }
    
    public function getCategoryInfo($categoryId)
    {
        $category = Category::where('status', true)->find($categoryId);
        
        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
        
        return response()->json($category);
    }

}
