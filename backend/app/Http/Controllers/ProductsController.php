<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Product_img;
use App\Models\CharacteristicType;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'images'])->get();

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
            'star' => 'required|boolean',
            'extra_key' => 'required|boolean',
            'key_price' => 'nullable|numeric|min:0',
            'installable' => 'required|boolean'
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
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp',
            'extra_key' => 'required|boolean',
            'key_price' => 'nullable|numeric|min:0',
            'installable' => 'required|boolean'
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
    

    public function getProductsByCategory($categoryId, Request $request)
    {
        $category = Category::find($categoryId);
        
        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
        
        $query = $category->products()
            ->where('status', true)
            ->with(['images', 'characteristics']);
        
        // Filtrar por características
        if ($request->has('characteristics') && !empty($request->characteristics)) {
            $characteristicIds = $request->characteristics;
            $query->whereHas('characteristics', function($q) use ($characteristicIds) {
                $q->whereIn('characteristic.id', $characteristicIds);
            });
        }
        
        // Filtrar por destacados
        if ($request->has('star') && $request->star) {
            $query->where('star', true);
        }
        
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
        
        $products = $query->get();
        
        return response()->json([
            'category' => $category,
            'products' => $products,
            'total' => $products->count()
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

    public function getProduct($id)
    {
        $product = Product::with(['category', 'images', 'characteristics.type'])
            ->where('status', true)
            ->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
        
        return response()->json($product);
    }


    public function getAllProducts(Request $request)
    {
        $query = Product::with(['category', 'images', 'characteristics'])
            ->where('status', true);
        
        // Filtrar por características
        if ($request->has('characteristics') && !empty($request->characteristics)) {
            $characteristicIds = $request->characteristics;
            $query->whereHas('characteristics', function($q) use ($characteristicIds) {
                $q->whereIn('characteristic.id', $characteristicIds);
            });
        }
        
        // Filtrar por categoría
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }
        
        // Filtrar por destacados
        if ($request->has('star') && $request->star) {
            $query->where('star', true);
        }
        
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
        
        $products = $query->get();
        
        return response()->json([
            'products' => $products,
            'total' => $products->count()
        ]);
    }
    
    public function getFilters()
    {
        // Obtener todos los tipos de características con sus características
        $characteristicsTypes = CharacteristicType::with(['characteristics' => function($q) {
            $q->where('status', true);  
        }])->where('status', true)->get();
        
        return response()->json($characteristicsTypes);
    }



}
