<?php

namespace App\Http\Controllers;
use App\Models\Solution;
use App\Models\Solution_img;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class SolutionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $solutions = Solution::with('images')->get();
        return response()->json($solutions);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $solution = Solution::with('images')->findOrFail($id);
        return response()->json($solution);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $solution = Solution::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:Pendent de revisar,Revisat,En procés,Finalitzat'
        ]);
        
        $solution->status = $request->status;
        $solution->save();
        
        return response()->json([
            'message' => 'Estat actualitzat correctament',
            'solution' => $solution
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
    
    /**
     * Download image
     */
    public function downloadImage($id)
    {
        $image = Solution_img::findOrFail($id);
        $path = storage_path('app/public/' . $image->path);
        
        if (file_exists($path)) {
            return response()->download($path, $image->name_img);
        }
        
        return response()->json(['message' => 'Imatge no trobada'], 404);
    }
    public function downloadFile($id)
    {
        $file = Solution_img::findOrFail($id);
        $path = storage_path('app/public/' . $file->path);
        
        if (file_exists($path)) {
            return response()->download($path, $file->name_img);
        }
        
        return response()->json(['message' => 'Arxiu no trobat'], 404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'surname' => 'required',
            'email' => 'required|email',
            'phone_number' => 'required|digits:9',
            'issue' => 'required',
            'description' => 'required',
        ]);
        
        $validated["status"] = "Pendent de revisar";
        $solution = Solution::create($validated);
        
        if ($request->hasFile('images')) {
            // Validar: imatges i PDF
            $request->validate([
                'images.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:10240' // 10MB màxim
            ]);

            foreach ($request->file('images') as $file) {
                $filename = uniqid().'_'.$file->getClientOriginalName();
                $path = $file->storeAs('solutions', $filename, 'public');

                Solution_img::create([
                    'solution_id' => $solution->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }
        
        return response()->json(['message' => 'Solicitud enviada correctamente']);
    }

    /**
     * Public index for frontend
     */
    public function publicIndex()
    {
        return response()->json(Solution::all());
    }
}